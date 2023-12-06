import mongoose, { Schema, Types } from 'mongoose';
import { activeStatus, userCurrency } from '../enum/user.enum';
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
  activStatus: {
    type: Number,
    default: activeStatus.ACTIVE,
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
  schedule: {
    sunday: [{ from: String, to: String }],
    monday: [{ from: String, to: String }],
    tuesday: [{ from: String, to: String }],
    wednesday: [{ from: String, to: String }],
    thursday: [{ from: String, to: String }],
    friday: [{ from: String, to: String }],
    saturday: [{ from: String, to: String }],
  },
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
