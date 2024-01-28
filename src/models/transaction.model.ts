import mongoose, { Schema, Types } from 'mongoose';
import { transactionStatus, transactionType } from '../enum/transaction.enum';
import { ITransaction } from '../interfaces/transaction.interface';

const transactionSchema = new Schema<ITransaction>({
  patientId: {
    type: Schema.Types.ObjectId,
  },
  doctorId: {
    type: Schema.Types.ObjectId,
  },
  source: {
    type: String,
    required: true
  },
  ammount: {
    type: Number,
    required: true
  },
  currency: {
    type: Schema.Types.ObjectId,
  },
  status: {
    type: Number,
    enum: transactionStatus, 
    default: transactionStatus.PENDING 
  },
  type: {
    type: String,
    enum: transactionType,
    required: true
  }
}, {
  timestamps: true 
});


const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;