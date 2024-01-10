import { NextFunction, Request, Response } from 'express';
import { userRole } from '../enum/user.enum';
import { ForbiddenError } from '../errors';

const checkUserRole = (allowedRole: userRole) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const currentUserRole = req.currentUser?.role;

      if (!currentUserRole || currentUserRole !== allowedRole) {
        const error = new ForbiddenError();
        return next(error);
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};

export default checkUserRole;
