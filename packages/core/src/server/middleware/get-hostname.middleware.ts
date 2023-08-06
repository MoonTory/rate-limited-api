import os from 'os';
import { Request, Response, NextFunction } from 'express';

export const getHostname = () => (_: Request, res: Response, __: NextFunction) => {
	res.status(200).json({
		message: `It's NodeJs - ${os.hostname()}`
	});
};
