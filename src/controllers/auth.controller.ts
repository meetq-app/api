import { NextFunction, Request, Response } from 'express';
import { respStatus } from '../enum/response.enum';
import { InvalidCreedentialsdError } from '../errors';
import { HelperService } from '../services/helper.service';
import { sendMail } from '../services/mail.service';
import userService from '../services/user.service';
const User = require('../models/user.model');

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const code = await userService.generateVerificationCode(email);
    await sendMail(email, 'Barev dzez', `<h1>your key ${code}</h1>`);

    res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, {}));
  } catch (err) {
    return next(err);
  }
};

const verifyLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, code } = req.body;
    let isNewUser = false;
    const isValid = await userService.checkVerifivationCode(email, code);
    if (!isValid) {
      throw new InvalidCreedentialsdError();
    }
    let user = await userService.findUserByEmail(email);
    if (!user) {
      user = await userService.createUser(email);
      isNewUser = true;
    }

    const token = userService.generateJWT(email, user._id.toString());

    res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { token, isNewUser }));
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

export { login, verifyLogin };
