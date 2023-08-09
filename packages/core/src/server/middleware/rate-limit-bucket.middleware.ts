import { Request, Response, NextFunction } from 'express';

import { config } from '../../config';
import { Middleware } from '../../typings';
import { RateLimiter } from '../../services';

export const rateLimitBucket: Middleware =
	(weight: number = 1) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const limiter = RateLimiter.getInstance();

		const ip = (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress as string);
		const userIdentifier: any = req.user ? req.user : ip;

		const windowInSeconds = config.RATE_LIMIT_WINDOW_IN_SECONDS;
		const maxTokens = req.user ? config.MAX_TOKEN_REQUEST_COUNT : config.MAX_IP_REQUEST_COUNT;

		try {
			const result = await limiter.bucketLimit(weight, userIdentifier, windowInSeconds, maxTokens);

			if (result === null) return next();

			return res.status(429).json(result);
		} catch (error) {
			return next(error);
		}
	};
