import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export type Middleware = (...args: any) => (req: any, res: any, next: any) => any;

export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => any;
