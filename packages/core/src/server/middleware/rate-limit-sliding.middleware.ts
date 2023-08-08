import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { config } from '../../config';
import { Redis } from '../../services';
import { Middleware } from '../../typings';

export const rateLimitSliding: Middleware =
	(weight: number = 1) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const now = Date.now();
		const redis = Redis.getInstance().client;

		const ip = (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress as string);
		const userIdentifier: any = req.user ? req.user : ip;

		const uniqueRequestKey = `${weight}-${uuid()}`;
		const expiration = config.RATE_LIMIT_WINDOW_IN_SECONDS;
		const startWindow = now - expiration * 1000;
		const limit = req.user ? config.MAX_TOKEN_REQUEST_COUNT : config.MAX_IP_REQUEST_COUNT;

		try {
			const multi = redis.multi();

			// Push the current timestamp to the list
			multi.zadd(userIdentifier, now.toString(), uniqueRequestKey);
			// Remove timestamps outside the current window
			multi.zremrangebyscore(userIdentifier, '-inf', startWindow.toString());
			// Get the number of requests user has made in the current window
			multi.zrangebyscore(userIdentifier, startWindow.toString(), 'inf');

			const results = (await multi.exec()) as any;

			// Calculate total weight from the values of requests within the window.
			const valuesArray = results[2][1];

			let totalWeight = 0;
			for (let i = 0; i < valuesArray.length; i++) {
				totalWeight += parseInt(valuesArray[i].split('-')[0], 10);
			}

			if (totalWeight > limit) {
				const resetTime = new Date();
				resetTime.setSeconds(resetTime.getSeconds() + expiration);

				return res.status(429).json({
					retryAfter: expiration,
					message: 'Rate limit exceeded',
					nextValidRequestTime: resetTime
				});
			}

			// If this is the first entry or we are still below the limit, reset the TTL.
			if (valuesArray.length === 0 || totalWeight <= limit) {
				redis.expire(userIdentifier, expiration);
			}

			return next();
		} catch (error) {
			return next(error);
		}
	};
