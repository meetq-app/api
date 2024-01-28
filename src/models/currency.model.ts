import mongoose, { Schema } from 'mongoose';
import { ICurrency } from "../interfaces";

const currencySchema = new Schema<ICurrency>({
  code: {
    type: String,
    required: true, 
    unique: true,   
    trim: true      
  },
  title: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  usdCourse: {
    type: Number,
    validate(value) {
      if (value <= 0) {
        throw new Error('USD course must be a positive number');
      }
    }
  }
});

const Currency = mongoose.model('Currency', currencySchema);
export default Currency