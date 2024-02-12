import mongoose, { Schema } from 'mongoose';
import { ICountry } from "../interfaces";

const countrySchema = new Schema<ICountry>({
  name: {
    type: String,
    required: true, 
    unique: true,   
    trim: true      
  },
  countryCode: {
    type: String,
    required: true
  },
});

const Country = mongoose.model('Country', countrySchema);
export default Country