import { Request, Response, NextFunction } from 'express';

import { config } from '../../config';
import { MiddlewareFunction } from '../../typings';
import { RateLimiter, RateLimitStrategy } from '../../services';

export const rateLimiter =
	(weight: number = 1, strategy: RateLimitStrategy = 'fixedWindow'): MiddlewareFunction =>
	async (req: Request, res: Response, next: NextFunction) => {
		const limiter = RateLimiter.getInstance();

		const userIdentifier: string = req.user
			? (req.user as string)
			: (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress as string);
		const expiration = config.RATE_LIMIT_WINDOW_IN_SECONDS;
		const limit = req.user ? config.MAX_TOKEN_REQUEST_COUNT : config.MAX_IP_REQUEST_COUNT;

		try {
			const result = await limiter[strategy](weight, userIdentifier, limit, expiration);

			if (result === null) return next();

			return res.status(429).json(result);
		} catch (error) {
			return next(error);
		}
	};
