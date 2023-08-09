import { Request, Response, NextFunction } from 'express';

import { config } from '../../config';
import { Middleware } from '../../typings';
import { Redis, RedisCommandResults } from '../../services';

export const rateLimit: Middleware =
	(weight: number = 1) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const redis = Redis.getInstance().client;

		const ip = (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress as string);

		const userIdentifier: any = req.user ? req.user : ip;

		const expiration = config.RATE_LIMIT_WINDOW_IN_SECONDS; // Expiration time in seconds (1 hour)
		const limit = req.user ? config.MAX_TOKEN_REQUEST_COUNT : config.MAX_IP_REQUEST_COUNT;

		try {
			const multi = redis.multi();
			multi.incrby(userIdentifier, weight); // Get the current count
			multi.ttl(userIdentifier); // Get the TTL

			const responses = (await multi.exec()) as RedisCommandResults;

			const currentTtl = responses[1][1];
			const currentCount = responses[0][1];

			const ttl = parseInt(currentTtl as string) || 0;
			const count = parseInt(currentCount as string) || 0;

			if (count > limit) {
				const resetTime = new Date();
				resetTime.setSeconds(resetTime.getSeconds() + ttl);

				return res.status(429).json({
					retryAfter: ttl,
					message: 'Rate limit exceeded',
					nextValidRequestTime: resetTime
				});
			}

			// If it's the first request from this user or if we haven't reached the limit, reset the TTL
			if (count === 1 || count <= limit) {
				redis.expire(userIdentifier, expiration);
			}

			return next();
		} catch (error) {
			return next(error);
		}
	};
