import { v4 as uuid } from 'uuid';

import { Redis, RedisPipelineResult } from '../redis';

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

	public fixedWindow = async (weight: number, userIdentifier: string, limit: number, expiration: number) => {
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

			return {
				retryAfter: ttl,
				message: 'Rate limit exceeded',
				nextValidRequestTime: resetTime
			};
		}

		// If it's the first request from this user or if we haven't reached the limit, reset the TTL
		if (count === 1 || count <= limit) {
			this._redis.client.expire(userIdentifier, expiration);
		}

		return null;
	};

	public slidingWindow = async (weight: number, userIdentifier: string, limit: number, expiration: number) => {
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

			return {
				retryAfter: expiration,
				message: 'Rate limit exceeded',
				nextValidRequestTime: resetTime
			};
		}

		// If this is the first entry or we are still below the limit, reset the TTL.
		if (valuesArray.length === 0 || totalWeight <= limit) {
			this._redis.client.expire(userIdentifier, expiration);
		}

		return null;
	};

	public bucketLimit = async (weight: number, userIdentifier: string, windowInSeconds: number, maxTokens: number) => {
		const script = this._redis.scripts['bucket-rate-limit'];

		const now = Date.now();

		const refillRate = maxTokens / windowInSeconds; // Tokens added per second
		const refillRateInMs = refillRate / 1000;

		const remainingTokens = (await this._redis.client.eval(script, 1, userIdentifier, weight, maxTokens, refillRateInMs, now)) as number;

		if (remainingTokens < 0) {
			const retryAfterSeconds = Math.ceil(Math.abs(remainingTokens) / refillRate);
			const nextValidRequestTimestamp = now + retryAfterSeconds * 1000;
			const nextValidRequestTime = new Date(nextValidRequestTimestamp);

			return {
				retryAfter: retryAfterSeconds,
				message: 'Rate limit exceeded',
				nextValidRequestTime: nextValidRequestTime.toISOString()
			};
		}

		return null;
	};
}
