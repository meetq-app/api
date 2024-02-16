import { Types } from 'mongoose';
import { userCountry, userCurrency, userGender } from '../enum/user.enum';

export interface IUser{
  _id: Types.ObjectId;
  email: string;
  fullName?: string;
  gender? : userGender;
  avatar?: string;
  country?: Types.ObjectId;
  timezone?: string;
  balance: number;
  dateOfBirth?: Date
  currency: Types.ObjectId;
}