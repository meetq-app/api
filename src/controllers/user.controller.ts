import { NextFunction, Request, Response } from 'express';
import { IUser } from '../interfaces';

const User = require('../models/user.model');

const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.currentUser;
    console.log('id', id);
    const user: IUser = await User.findOne({_id: id});
    console.log('user', user);
    res.status(200).send(user);
  } catch (err) {
    return next(err);
  }
};

export { getUserInfo };
