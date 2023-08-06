import { Request, Response, NextFunction } from 'express';

import { Map } from '../utils';
import { Middleware } from './middleware.types';

export abstract class EndpointFunction {
	// or even private
	protected req: Request;
	protected res: Response;
	protected next: NextFunction;
	public readonly middlewares: Middleware[];

	constructor(middlewares: Middleware[]) {
		this.middlewares = middlewares;
	}

	protected abstract executeImpl(): Promise<void | any>;

	public execute = () => async (req: Request, res: Response, next: NextFunction) => {
		this.req = req;
		this.res = res;
		this.next = next;

		try {
			await this.executeImpl();
		} catch (error) {
			this.next(error);
		}
	};

	protected jsonResponse(code: number, payload: any) {
		return this.res.status(code).json({ payload });
	}

	protected ok(dto?: any) {
		if (!!dto) {
			return this.res.status(200).json(dto);
		} else {
			return this.res.sendStatus(200);
		}
	}

	protected created(payload?: any) {
		return this.jsonResponse(201, payload ? payload : 'Created');
	}

	protected clientError(payload?: any) {
		return this.jsonResponse(400, payload ? payload : 'Unauthorized');
	}

	protected unauthorized(payload?: any) {
		return this.jsonResponse(401, payload ? payload : 'Unauthorized');
	}

	protected paymentRequired(payload?: any) {
		return this.jsonResponse(402, payload ? payload : 'Payment required');
	}

	protected forbidden(payload?: any) {
		return this.jsonResponse(403, payload ? payload : 'Forbidden');
	}

	protected notFound(payload?: any) {
		return this.jsonResponse(404, payload ? payload : 'Not found');
	}

	protected conflict(payload?: any) {
		return this.jsonResponse(409, payload ? payload : 'Conflict');
	}

	protected tooMany(payload?: any) {
		return this.jsonResponse(429, payload ? payload : 'Too many requests');
	}

	protected fail(error: Error | string) {
		if (typeof error === typeof Error) return this.jsonResponse(500, error);

		return this.res.status(500).json({
			message: error.toString()
		});
	}
}

export interface EndpointMap extends Map<EndpointFunction> {}
