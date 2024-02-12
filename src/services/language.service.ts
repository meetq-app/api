import { ICurrency, Ilanguage } from "../interfaces";
import Language from "../models/language.model";

class LanguageService{
    async getLanguages(): Promise<Ilanguage[]> {
        const languages = await Language.find();
        return languages;
    }
}

export default new LanguageService();