import { NextFunction, Request, Response } from 'express';
import { appLanguage } from '../enum/app.enum';
import { userCountry, userCurrency, userGender, userLanguage } from '../enum/user.enum';
import Offering from '../models/offering.model';
import patientService from '../services/patient.service';

export class GeneralController {
  async getOfferings(req: Request, res: Response, next: NextFunction) {
    try {
      const lang = req.lang;

      const offerings = await Offering.aggregate([
        {
          $project: {
            _id: 1,
            name: `$name.${lang}`,
            description: `$description.${lang}`
          }
        }
      ]);
      
      res.status(200).send(offerings);
    } catch (err) {
      return next(err);
    }
  }

  async getUserEnums(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send({ userCurrency, userLanguage, userGender, userCountry });
    } catch (err) {
      return next(err);
    }
  }

  async getAppEnums(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send({ appLanguage });
    } catch (err) {
      return next(err);
    }
  }
}
