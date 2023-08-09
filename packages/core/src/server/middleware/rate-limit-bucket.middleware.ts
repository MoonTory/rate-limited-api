import { Request, Response, NextFunction } from 'express';

import { config } from '../../config';
import { Redis } from '../../services';
import { Middleware } from '../../typings';

export const rateLimitBucket: Middleware =
	(weight: number = 1) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const redis = Redis.getInstance().client;
		const script = Redis.getInstance().scripts['bucket-rate-limit'];

		const ip = (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress as string);
		const userIdentifier: any = req.user ? req.user : ip;

		const windowInSeconds = config.RATE_LIMIT_WINDOW_IN_SECONDS;
		const maxTokens = req.user ? config.MAX_TOKEN_REQUEST_COUNT : config.MAX_IP_REQUEST_COUNT;

		const refillRate = maxTokens / windowInSeconds; // Tokens added per second
		const refillRateInMs = refillRate / 1000;

		try {
			const now = Date.now();
			const remainingTokens = (await redis.eval(script, 1, userIdentifier, weight, maxTokens, refillRateInMs, now)) as number;

			if (remainingTokens < 0) {
				const retryAfterSeconds = Math.ceil(Math.abs(remainingTokens) / refillRate);
				const nextValidRequestTimestamp = now + retryAfterSeconds * 1000;
				const nextValidRequestTime = new Date(nextValidRequestTimestamp);

				return res.status(429).json({
					retryAfter: retryAfterSeconds,
					message: 'Rate limit exceeded',
					nextValidRequestTime: nextValidRequestTime.toISOString()
				});
			}

			return next();
		} catch (error) {
			return next(error);
		}
	};
