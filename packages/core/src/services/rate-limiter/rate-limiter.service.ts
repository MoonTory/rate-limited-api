import { v4 as uuid } from 'uuid';

import { Redis, RedisPipelineResult } from '../redis';

export type RateLimitResult = {
	message: string;
	retryAfter: number;
	nextValidRequestTime: Date;
};

export type RateLimitStrategy = 'fixedWindow' | 'slidingWindow' | 'tokenBucket';

export class RateLimiter {
	private static _instance: RateLimiter;
	private readonly _redis: Redis;

	private constructor() {
		this._redis = Redis.getInstance();
	}

	public static getInstance(): RateLimiter {
		if (!RateLimiter._instance) {
			RateLimiter._instance = new RateLimiter();
		}
		return RateLimiter._instance;
	}

	private result = (retryAfter: number, nextValidRequestTime: Date): RateLimitResult => ({
		retryAfter,
		nextValidRequestTime,
		message: 'Rate limit exceeded'
	});

	public fixedWindow = async (
		weight: number,
		userIdentifier: string,
		limit: number,
		expiration: number
	): Promise<RateLimitResult | null> => {
		const multi = this._redis.client.multi();

		multi.incrby(userIdentifier, weight); // Get the current count
		multi.ttl(userIdentifier); // Get the TTL

		const responses = (await multi.exec()) as RedisPipelineResult;

		const currentTtl = responses[1][1];
		const currentCount = responses[0][1];

		const ttl = parseInt(currentTtl as string) || 0;
		const count = parseInt(currentCount as string) || 0;

		if (count > limit) {
			const resetTime = new Date();
			resetTime.setSeconds(resetTime.getSeconds() + ttl);

			return this.result(ttl, resetTime);
		}

		// If it's the first request from this user or if we haven't reached the limit, reset the TTL
		if (count === 1 || count <= limit) {
			this._redis.client.expire(userIdentifier, expiration);
		}

		return null;
	};

	public slidingWindow = async (
		weight: number,
		userIdentifier: string,
		limit: number,
		expiration: number
	): Promise<RateLimitResult | null> => {
		const now = Date.now();
		const multi = this._redis.client.multi();

		const startWindow = now - expiration * 1000; // Start window in ms.
		const uniqueRequestKey = `${weight}-${uuid()}`;

		// Push the current timestamp to the list
		multi.zadd(userIdentifier, now.toString(), uniqueRequestKey);
		// Remove timestamps outside the current window
		multi.zremrangebyscore(userIdentifier, '-inf', startWindow.toString());
		// Get the number of requests user has made in the current window
		multi.zrangebyscore(userIdentifier, startWindow.toString(), 'inf');

		const results = (await multi.exec()) as RedisPipelineResult;

		// Calculate total weight from the values of requests within the window.
		const valuesArray = results[2][1];

		let totalWeight = 0;

		for (let i = 0; i < valuesArray.length; i++) {
			totalWeight += parseInt(valuesArray[i].split('-')[0], 10);
		}

		if (totalWeight > limit) {
			const resetTime = new Date();
			resetTime.setSeconds(resetTime.getSeconds() + expiration);

			return this.result(expiration, resetTime);
		}

		// If this is the first entry or we are still below the limit, reset the TTL.
		if (valuesArray.length === 0 || totalWeight <= limit) {
			this._redis.client.expire(userIdentifier, expiration);
		}

		return null;
	};

	public tokenBucket = async (
		weight: number,
		userIdentifier: string,
		maxTokens: number,
		windowInSeconds: number
	): Promise<RateLimitResult | null> => {
		const script = this._redis.scripts['bucket-rate-limit'];

		const now = Date.now();

		const refillRate = maxTokens / windowInSeconds; // Tokens added per second
		const refillRateInMs = refillRate / 1000;

		const [remainingTokens, lastRefill] = (await this._redis.client.eval(
			script,
			1,
			userIdentifier,
			weight,
			maxTokens,
			refillRateInMs,
			now
		)) as any[];

		if (remainingTokens < 0) {
			const elapsedTimeInSeconds = (now - lastRefill) / 1000;

			const tokensRefilled = elapsedTimeInSeconds * refillRate;
			const tokensRequired = weight - tokensRefilled;

			const retryAfter = Math.ceil(tokensRequired / refillRate);

			const tokensToBeRefilled = Math.abs(remainingTokens);
			const secondsToRefill = Math.ceil(tokensToBeRefilled / refillRate);

			const nextValidRequestTimestamp = Number(lastRefill) + secondsToRefill * 1000;
			const nextValidRequestTime = new Date(nextValidRequestTimestamp);

			return this.result(retryAfter, nextValidRequestTime);
		}

		return null;
	};
}
