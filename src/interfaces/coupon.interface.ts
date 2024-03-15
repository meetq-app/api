import { Types } from 'mongoose';

export interface ICoupon{
  _id: Types.ObjectId;
  code: string;
  ammount: number;
  applyed_by?: Types.ObjectId;
  applyed_date?: Date
}