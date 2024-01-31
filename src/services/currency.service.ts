import { ICurrency } from "../interfaces";
import Currency from "../models/currency.model";

class CurrencyService{
    async getCurrencyList(): Promise<ICurrency[]> {
        const currencies = await Currency.find();
        return currencies;
    }
}

export default new CurrencyService();