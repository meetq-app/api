import { NextFunction, Request, Response } from 'express';
import { appLanguage } from '../enum/app.enum';

declare global {
    namespace Express {
      interface Request {
        lang: appLanguage;
      }
    }
  }

const detectLanguage = (req: Request, res: Response, next: NextFunction) => {
  const lang = (req.headers?.lang || appLanguage.EN) as appLanguage;
  req.lang = lang;
  next();
};

export default detectLanguage;
