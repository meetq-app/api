import { Types } from 'mongoose';
import { userGender } from '../enum/user.enum';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  fullName?: string;
  gender? : userGender;
  avatar?: string;
  balance: number;
}