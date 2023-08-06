import { Response, NextFunction } from 'express';

import { RequestError, Middleware } from '../../typings';

export const catch404: Middleware = () => (_: any, __: Response, next: NextFunction) => {
	const err = new RequestError('Not Found', 404);

	return next(err);
};
