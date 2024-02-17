import { title } from 'process';
import { appLanguage } from '../enum/app.enum';
import { userLanguage } from '../enum/user.enum';
import { ICountry, Ilanguage } from '../interfaces';
import Country from '../models/country.model';

class CountryService {
  async getCountries(lang: appLanguage): Promise<ICountry[]> {
    const countries = await Country.aggregate([
      {
        $project: {
          _id: 1,
          countryCode: 1,
          name: `$name.${lang}`,
        },
      },
    ]);
    return countries;
  }
}

export default new CountryService();
