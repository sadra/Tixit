import { NotAuthorizedError } from './../errors/notAuthorized.error';
import { Request, Response, NextFunction } from 'express';

export const RequireAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new NotAuthorizedError();
  }

  next();
};
