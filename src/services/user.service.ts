import { ObjectId, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import { redisClient } from '../db/redis';
import { InvalidCreedentialsdError } from '../errors';
import { IUser } from '../interfaces';
import { IUserService } from '../interfaces/user-service.interface';
import User from '../models/user.model';
import { HelperService } from './helper.service';
import { userRole } from '../enum/user.enum';

class UserService implements IUserService {
  userVerificationPrefix = 'USER_VERIFY';
  userVerificationTTL = 900; // 15 minutes

  async findUserById(id: Schema.Types.ObjectId): Promise<IUser> {
    const user: IUser = await User.findOne({ id });
    return user;
  }

  async findUserByEmail(email: string): Promise<IUser> {
    const user: IUser = await User.findOne({ email });
    return user;
  }

  async createUser(email: string): Promise<IUser> {
    try {
      const user = new User({ email });
      const newUser = await user.save();
      return newUser;
    } catch (err) {
      if (err.name === 'MongoServerError' || err.name === 'ValidationError') {
        console.log('mongoose err', err);
        if (err.code === 11000) {
          err.message = 'Email in use';
        }
        const error = new InvalidCreedentialsdError('Invalid Creedentials', err.errors ?? err.message);
        throw error;
      }
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

  generateJWT(email: string, id: string): string {
    const token = jwt.sign(
      {
        id,
        email,
        role: userRole.USER
      },
      process.env.JWT_SECRET,
    );

    return token;
  }
}

export default new UserService();
