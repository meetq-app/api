import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { respStatus } from '../enum/response.enum';
import { userRole } from '../enum/user.enum';
import { IUserFilters } from '../interfaces';
import { IMeetingFilters } from '../interfaces/meeting-filters.interface';
import { HelperService } from '../services/helper.service';
import patientService from '../services/patient.service';
import transactionService from '../services/transaction.service';

const Patient = require('../models/patient.model');
export class PatientController {
  async getPatientInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.currentUser;
      const lang = req.lang;
      const patient = await patientService.findUserById(id, lang);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { patient }));
    } catch (err) {
      return next(err);
    }
  }

  async updatePatientInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.currentUser;
      const updatedPatient = await patientService.update(id, req.body);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { patient: updatedPatient }));
    } catch (err) {
      return next(err);
    }
  }

  async updatePatientAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.currentUser;
      const { avatar } = req.body;

      const avatarPath = await patientService.updateAvatar(id, avatar);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { avatar: avatarPath }));
    } catch (err) {
      return next(err);
    }
  }

  async getDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const {lang} = req;
      //@ts-ignore
      const doctors = await patientService.getDoctors(req.query as IUserFilters, lang); //TODO temp solution untill impliment validatitions
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { doctors }));
    } catch (err) {
      console.error('error in getting doctors ctrl', err);
      return next(err);
    }
  }

  async getDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: doctorId } = req.params;
      const lang = req.lang;
      const doctor = await patientService.getDoctor(doctorId, lang);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { doctor }));
    } catch (err) {
      console.error('error in getting doctor ctrl', err);
      return next(err);
    }
  }

  async getDoctorsTimeSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: doctorId, date } = req.params;
      const slots = await patientService.getDoctorsTimeSlotsByDate(doctorId, date);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { slots }));
    } catch (err) {
      console.error('error in getting avialable time slots', err);
      return next(err);
    }
  }

  async bookMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.currentUser.id;
      const { slot } = req.body;
      const doctorId = new Types.ObjectId(req.body.doctorId);
      const offerId = new Types.ObjectId(req.body.offerId);
      const date = new Date(req.body.date);

      const meeting = await patientService.bookMeeting(patientId, doctorId, date, slot, offerId);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { meeting }));
    } catch (err) {
      console.error('error in booking a meet', err);
      return next(err);
    }
  }

  async cancelMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser.id.toString();
      const { id } = req.params;
      const { reason } = req.body;
      const meeting = await patientService.cancelMeeting(userId, id, reason);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { meeting }));
    } catch (err) {
      console.error('error in cancelling a meet', err);
      return next(err);
    }
  }

  async finishMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser.id.toString();
      const { id } = req.params;
      const { raiting, comment } = req.body;
      const doctorRaiting = await patientService.finishAndRateMeeting(userId, id, raiting, comment);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { doctorRaiting }));
    } catch (err) {
      console.error('error in finishing a meet', err);
      return next(err);
    }
  }

  async getMeetings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser.id;
      const { lang } = req;
      const { status } = req.params;
      //@ts-ignore
      const meetings = await patientService.getMeetings(userId, status, req.query as IMeetingFilters, lang);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { meetings }));
    } catch (err) {
      console.error('error in getting meetings for patient', err);
      return next(err);
    }
  }

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser.id;
      console.log({userId});
      const transactions = await transactionService.getUserTransactions(userId, userRole.PATIENT);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { transactions }));
    } catch (err) {
      console.error('error in getting transactions for patient', err);
      return next(err);
    }
  }
}
