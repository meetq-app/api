import mongoose, { Types } from 'mongoose';
import { isExpressionWithTypeArguments } from 'typescript';
import { transactionStatus, transactionType } from '../enum/transaction.enum';
import { userRole } from '../enum/user.enum';
import { IDoctor, IOffering, IPatient } from '../interfaces';
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
        $sort: {
          createdAt : -1
        }
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
          date: '$createdAt',
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

  async patientToDoctorTransaction(patient: any, doctor: any, amount: number): Promise<boolean> {
    patient.balance -= amount;
    doctor.balance += amount;

    const patientTransaction = new Transaction({
      doctorId: null,
      patientId: patient._id,
      source: doctor.fullName,
      ammount: amount,
      type: transactionType.OUTCOME,
      currency: patient.currency,
      status: transactionStatus.SUCCESS,
    });

    const doctorTransaction = new Transaction({
      doctorId: doctor._id,
      patientId: null,
      source: patient.fullName,
      ammount: amount,
      type: transactionType.INCOME,
      currency: doctor.currency,
      status: transactionStatus.SUCCESS,
    });

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      await patient.save();
      await doctor.save();
      await patientTransaction.save();
      await doctorTransaction.save();

      await session.commitTransaction();
      console.log('Transaction committed successfully');
    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction aborted due to error:', error);
    } finally {
      await session.endSession();
    }

    return true;
  }

  async couponTransaction(patient: any, coupon: any): Promise<boolean> {
    patient.balance += coupon.ammount;
    coupon.applyed_by = patient._id;
    coupon.applyed_date = new Date;

    const patientTransaction = new Transaction({
      doctorId: null,
      patientId: patient._id,
      source: "Coupon",
      ammount: coupon.ammount,
      type: transactionType.INCOME,
      currency: patient.currency,
      status: transactionStatus.SUCCESS,
    });

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      await patient.save();
      await coupon.save();
      await patientTransaction.save();
      await session.commitTransaction();
      console.log('Transaction committed successfully');
    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction aborted due to error:', error);
      throw new Error("Something went wrong");
    } finally {
      await session.endSession();
    }

    return true;
  }

  async meetingCancelationTransaction(patient: any, doctor: any, amount: number): Promise<boolean> {
    
    return true
  }
}

export default new TransactionService();
