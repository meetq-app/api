import mongoose, { Schema } from 'mongoose';
import { appLanguage } from '../enum/app.enum';
import { ICountry } from "../interfaces";

const countrySchema = new Schema<ICountry>({
  name: {
    [appLanguage.AM]: {type: String, required: true},
    [appLanguage.RU]: {type: String, required: true},
    [appLanguage.EN]: {type: String, required: true}
  },
  countryCode: {
    type: String,
    required: true
  },
});

const Country = mongoose.model('Country', countrySchema);
export default Country