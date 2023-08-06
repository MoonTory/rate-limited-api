import { Response } from 'express';
import { Middleware } from '../../typings';

export const ErrorHandler: Middleware = (err: any, req: any, res: Response, next: any) => {
	if (res.headersSent) {
		return next(err);
	}

	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.json({
		error: {
			code: err.code ? err.code : undefined,
			message: err.message
		}
	});
};
