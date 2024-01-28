import { Types } from 'mongoose';
import { transactionStatus, transactionType } from '../enum/transaction.enum';
import { userRole } from '../enum/user.enum';
import { ITransaction } from '../interfaces/transaction.interface';
import Currency from '../models/currency.model';
import Transaction from '../models/transaction.model';

class TransactionService {
  async getUserTransactions(userId: Types.ObjectId, userType: userRole): Promise<ITransaction[]> {
    userId = new Types.ObjectId(userId);
    const query: any = userType === userRole.PATIENT ? { patientId: userId } : { doctorId: userId };
    query.status = transactionStatus.SUCCESS;
    const transactions = await Transaction.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: Currency.collection.name,
          localField: 'currency',
          foreignField: '_id',
          as: 'currency',
        },
      },
      {
        $unwind: '$currency',
      },
      {
        $project: {
          _id: 1,
          patientId: 1,
          doctorId: 1,
          source: 1,
          ammount: { $toString: '$ammount' },
          status: 1,
          type: 1,
          currency: '$currency',
        },
      },
    ]);
    return transactions;
  }

  async CreateTransaction(
    doctorId: Types.ObjectId,
    patientId: Types.ObjectId,
    source: string,
    ammount: number,
    type: transactionType,
    currency: Types.ObjectId,
    status: transactionStatus = transactionStatus.SUCCESS,
  ): Promise<ITransaction> {
    const transaction = new Transaction({
      doctorId,
      patientId,
      source,
      ammount,
      type,
      currency,
      status,
    });

    await transaction.save();
    return transaction;
  }
}

export default new TransactionService();
