import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { appLanguage } from '../enum/app.enum';
import { userRole } from '../enum/user.enum';
import { UnAuthorizedError } from '../errors';
interface UserPayload {
  id: Types.ObjectId;
  email: string;
  fullName: string;
  role: userRole;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
      lang: appLanguage;
    }
  }
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const error = new UnAuthorizedError();
  if (!req.headers.authorization) {
    return next(error);
  }

  try {
    const splitedToken = String(req.headers.authorization).split(' ');
    if (splitedToken.length !== 2 && splitedToken[0] !== 'Bearer') {
      return next(error);
    }
    const payload = jwt.verify(splitedToken[1], process.env.JWT_SECRET) as UserPayload;
    console.log('payload', splitedToken);
    req.currentUser = payload;
    return next();
  } catch (err) {
    console.error('err in auth', err);
    const error = new UnAuthorizedError();
    return next(error);
  }
};

export default auth;
