import { NextFunction, Request, Response } from 'express';
import { appLanguageData } from '../enum/app.enum';
import { respStatus } from '../enum/response.enum';
import { userCountry, userCurrency, userGender, userLanguageData } from '../enum/user.enum';
import Offering from '../models/offering.model';
import currencyService from '../services/currency.service';
import { HelperService } from '../services/helper.service';
import languageService from '../services/language.service';

export class GeneralController {
  async getOfferings(req: Request, res: Response, next: NextFunction) {
    try {
      const lang = req.lang;

      const offerings = await Offering.aggregate([
        {
          $project: {
            _id: 1,
            name: `$name.${lang}`,
            description: `$description.${lang}`,
          },
        },
      ]);

      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { offerings }));
    } catch (err) {
      return next(err);
    }
  }

  async getUserEnums(req: Request, res: Response, next: NextFunction) {
    try {
      const currencies = await currencyService.getCurrencyList();
      const languages = await languageService.getLanguages();
      res.status(200).send(
        HelperService.formatResponse(respStatus.SUCCESS, {
          userCurrency: currencies,
          userLanguage: languages,
          userGender,
          userCountry,
        }),
      );
    } catch (err) {
      return next(err);
    }
  }

  async getAppEnums(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(200)
        .send(HelperService.formatResponse(respStatus.SUCCESS, { appLanguage: appLanguageData }));
    } catch (err) {
      return next(err);
    }
  }
}
