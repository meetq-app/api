import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { InvalidCreedentialsdError } from '../errors';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new InvalidCreedentialsdError('Validation failed', errors.array());
  }

  next();
};
