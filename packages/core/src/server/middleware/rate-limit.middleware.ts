import { NextFunction, Request, Response } from 'express';

import { config } from '../../config';
import { Redis } from '../../services';
import { Middleware } from '../../typings';

export const rateLimit: Middleware =
	(weight: number = 1) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const redis = Redis.getInstance().client;
		const multi = redis.multi();

		const ip = (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress as string);

		const userIdentifier: any = req.user ? req.user : ip;

		const expiration = config.RATE_LIMIT_WINDOW_IN_SECONDS; // Expiration time in seconds (1 hour)
		const limit = req.user ? config.MAX_TOKEN_REQUEST_COUNT : config.MAX_IP_REQUEST_COUNT;

		try {
			multi.incrBy(userIdentifier, weight); // Get the current count
			multi.ttl(userIdentifier); // Get the TTL

			const [currentCount, currentTtl] = await multi.exec(true);

			const ttl = parseInt(currentTtl as string);
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
				redis.expire(ip, expiration);
			}

			return next();
		} catch (error) {
			return next(error);
		}
	};
