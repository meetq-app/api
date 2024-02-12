import { ICountry, Ilanguage } from "../interfaces";
import Country from "../models/country.model";

class CountryService{
    async getCountries(): Promise<ICountry[]> {
        const countries = await Country.find();
        return countries;
    }
}

export default new CountryService();