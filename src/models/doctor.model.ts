import mongoose, { Schema, Types } from 'mongoose';
import { userCurrency } from '../enum/user.enum';
import { IDoctor } from '../interfaces/doctor.interface';

const doctorSchema = new Schema<IDoctor>({
  fullName: {
    type: String,
    minLength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    minLength: 10,
    maxlength: 30,
    required: true,
    unique: true,
    match:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  gender: {
    type: String,
  },
  avatar: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: userCurrency.AMD,
  },
  country: {
    type: String,
  },
  info: {
    type: String,
  },
  certificates: {
    type: [String],
  },
  offerings: {
    type: [
      {
        offer: Types.ObjectId,
        price: Number,
      },
    ],
  },
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
