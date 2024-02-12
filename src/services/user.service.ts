import { Document, Model, ObjectId, Schema, Types } from 'mongoose';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import { redisClient } from '../db/redis';
import { InvalidCreedentialsdError } from '../errors';
import { HelperService } from './helper.service';
import { userRole } from '../enum/user.enum';
import { IUserService } from '../interfaces/user-service.interface';
import Currency from '../models/currency.model';
import Language from '../models/language.model';

export abstract class UserService implements IUserService {
  userModel: Model<Document>;

  userVerificationPrefix = 'USER_VERIFY';
  userVerificationTTL = 900; // 15 minutes

  async findUserById(id: Types.ObjectId, role: userRole = userRole.PATIENT): Promise<Document> {
    
    id = new Types.ObjectId(id);
    const pipeline: any[] = [
      {
        $match: { _id: id },
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
        $lookup: {
          from: Language.collection.name,
          localField: 'languages',
          foreignField: '_id',
          as: 'languages',
        },
      },
      {
        $unwind: { path: '$languages', preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: '$currency', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          balance: { $toString: '$balance' },
          fullName: 1,
          rating: 1,
          ratedCount: 1,
          gender: 1,
          avatar: 1,
          speciality: 1,
          currency: { $ifNull: ['$currency', null] },
          info: 1,
          certificates: 1,
          languages: { $ifNull: ['$languages', null] },
        },
      },
      { $limit: 1 },
    ]

    if (role === userRole.PATIENT){
      pipeline.push({
        $group: {
          _id: '$_id',
          avatar: { $first: '$avatar' },
          email: { $first: '$email' },
          balance: { $first: { $toString: '$balance' } },
          fullName: { $first: '$fullName' },
          gender: { $first: '$gender' },
          country: { $first: '$country' },
          timezone: { $first: '$timezone' },
          currency: { $first: '$currency' },
        },
      }); 
    } else{
      pipeline.push({
        $group: {
          _id: '$_id',
          avatar: { $first: '$avatar' },
          email: { $first: '$email' },
          balance: { $first: { $toString: '$balance' } },
          fullName: { $first: '$fullName' },
          rating: { $first: '$rating' },
          ratedCount: { $first: '$ratedCount' },
          gender: { $first: '$gender' },
          country: { $first: '$country' },
          timezone: { $first: '$timezone' },
          info: { $first: '$info' },
          currency: { $first: '$currency' },
          certificates: { $first: '$certificates' },
          speciality: { $first: '$speciality' },
          languages: { $push: '$languages' }, 
        },
      });
    }

    const users = await this.userModel.aggregate(pipeline);
    return users[0];
  }

  async findUserByEmail(email: string): Promise<Document> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async createUser(email: string): Promise<Document> {
    try {
      const user = new this.userModel({ email, fullName: email.split('@')[0] });
      const newUser = await user.save();
      return newUser;
    } catch (err) {
      if (err.name === 'MongoServerError' || err.name === 'ValidationError') {
        console.log('mongoose err', err);
        if (err.code === 11000) {
          err.message = 'Email in use';
        }
        const error = new InvalidCreedentialsdError(
          'Invalid Creedentials',
          err.errors ?? err.message,
        );
        throw error;
      }
    }
  }

  async updateAvatar(id: Types.ObjectId, base64String: string): Promise<string> {
    try {
      const filename = `avatar_${uuid()}.png`;
      const filePath = `avatar/${filename}`;
      await HelperService.saveBase64Image(base64String, filePath);
      const avatarAbsolutePath = `${process.env.SPACE_CDN_ENDPOINT}/${filePath}`;
      await this.userModel.findByIdAndUpdate(id, { avatar: avatarAbsolutePath });
      return avatarAbsolutePath;
    } catch (e) {
      throw new Error(e);
    }
  }

  async generateVerificationCode(email: string): Promise<number> {
    try {
      const code = HelperService.generateRandomSixDigitNumber();
      const prefixedKey = `${this.userVerificationPrefix}:${email}`;
      await redisClient.set(prefixedKey, code, { EX: this.userVerificationTTL });
      return code;
    } catch (err) {
      console.error('error in seting redis', err);
      throw new err();
    }
  }

  async checkVerifivationCode(email: string, code: string): Promise<boolean> {
    try {
      const prefixedKey = `${this.userVerificationPrefix}:${email}`;
      let savedCode = await redisClient.get(prefixedKey);
      return savedCode === code;
    } catch (err) {
      console.error('error in seting redis', err);
      throw new err();
    }
  }

  generateJWT(email: string, id: string, role: userRole): string {
    const token = jwt.sign(
      {
        id,
        email,
        role,
      },
      process.env.JWT_SECRET,
    );

    return token;
  }
}
