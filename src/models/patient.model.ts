import mongoose, { Schema } from 'mongoose';
import { userCurrency } from '../enum/user.enum';
import { IPatient } from '../interfaces/patient.interface';

const patientSchema = new Schema<IPatient>({
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
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
