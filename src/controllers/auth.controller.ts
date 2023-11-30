import { NextFunction, Request, Response } from 'express';
import { respStatus } from '../enum/response.enum';
import { InvalidCreedentialsdError } from '../errors';
import { HelperService } from '../services/helper.service';
import { sendMail } from '../services/mail.service';
import { UserService } from '../services/user.service';

export class AuthController {
  service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const code = await this.service.generateVerificationCode(email);
      await sendMail(email, 'Barev dzez', `<h1>your key ${code}</h1>`);

      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, {}));
    } catch (err) {
      console.error('err in login', err);
      return next(err);
    }
  }

  async verifyLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, code } = req.body;
      let isNewUser = false;
      const isValid = await this.service.checkVerifivationCode(email, code);
      if (!isValid) {
        throw new InvalidCreedentialsdError();
      }
      let user = await this.service.findUserByEmail(email);
      if (!user) {
        user = await this.service.createUser(email);
        isNewUser = true;
      }

      //@ts-ignore
      const token = this.service.generateJWT(email, user._id.toString());

      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { token, isNewUser }));
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
}
