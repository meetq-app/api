import { NextFunction, Request, Response } from 'express';
import { appLanguage } from '../enum/app.enum';

declare global {
    namespace Express {
      interface Request {
        lang: appLanguage;
        timezone: number;
      }
    }
  }

const detectUserSettingd = (req: Request, res: Response, next: NextFunction) => {
  const lang = (req.headers?.lang || appLanguage.EN) as appLanguage;
  const timezone = parseInt(req.headers?.timezone as string) || 0;
  req.lang = lang;
  req.timezone = timezone
  next();
};

export default detectUserSettingd;
