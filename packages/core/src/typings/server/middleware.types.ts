export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export type Middleware = (...args: any) => (req: any, res: any, next: any) => any;
