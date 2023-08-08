import { Redis } from '../../services';
import { Middleware, RequestError } from '../../typings';

export const clearCache: Middleware = () => async (_, res, next) => {
	const flush = await Redis.getInstance().client.flushdb();

	if (!flush) return next(new RequestError('Unable to flush', 500));

	return res.status(200).json();
};
