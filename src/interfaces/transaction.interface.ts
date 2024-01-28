import { Types } from 'mongoose';
import { ICurrency } from '.';
import { transactionStatus, transactionType } from '../enum/transaction.enum';

export interface ITransaction{
  _id: Types.ObjectId;
  patientId?: Types.ObjectId,
  doctorId?: Types.ObjectId,
  source: string,
  ammount: number;
  currency : Types.ObjectId;
  status: transactionStatus;
  type: transactionType
}