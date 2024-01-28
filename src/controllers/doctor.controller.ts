import { NextFunction, Request, Response } from 'express';
import { respStatus } from '../enum/response.enum';
import { userRole } from '../enum/user.enum';
import doctorService from '../services/doctor.service';
import { HelperService } from '../services/helper.service';
import transactionService from '../services/transaction.service';

const Doctor = require('../models/doctor.model');

export class DoctorController {
  async getDoctorInfo (req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.currentUser;
      const doctor = await doctorService.findUserById(id);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, {doctor}));
    } catch (err) {
      return next(err);
    }
  };

  async updateDoctorInfo (req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.currentUser;
      const updatedDoctor = await doctorService.update(id, req.body);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, {doctor: updatedDoctor}));
    } catch (err) {
      return next(err);
    }
  };

  async updateDoctorAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.currentUser;
      const { avatar } = req.body;

      const avatarPath = await doctorService.updateAvatar(id, avatar);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, {avatar: avatarPath}));
    } catch (err) {
      return next(err);
    }
  }

  async addDoctorCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.currentUser;
      const { certificates } = req.body;

      const certificatePaths = await doctorService.addCertificate(id, certificates);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, {certificates: certificatePaths}));
    } catch (err) {
      return next(err);
    }
  }

  async updateDoctorSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.currentUser;
      const { schedule } = req.body;

      const updatedSchedule = await doctorService.manageSchedule(id, schedule);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, {schedule: updatedSchedule}));
    } catch (err) {
      return next(err);
    }
  }

  async updateDoctorOfferings(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.currentUser;
      const { offerings } = req.body;

      console.log({id});
      console.log({offerings});

      const updatedofferings = await doctorService.manageOfferings(id, offerings);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, {schedule: updatedofferings}));
    } catch (err) {
      return next(err);
    }
  }

  async cancelMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser.id.toString();
      const { id } = req.params;
      const { reason } = req.body;
      const meeting = await doctorService.cancelMeeting(userId, id, reason);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { meeting }));
    } catch (err) {
      console.error('error in cancelling a meet', err);
      return next(err);
    }
  }

  async confirmMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser.id.toString();
      const { id } = req.params;
      const doctorRaiting = await doctorService.confirmMeeting(userId, id);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { doctorRaiting }));
    } catch (err) {
      console.error('error in finishing a meet', err);
      return next(err);
    }
  }

  async getlMeetings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser.id;
      const { status } = req.params;
      //@ts-ignore
      const meetings = await patientService.getMeetings(userId, status, req.query as IMeetingFilters);
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
      const transactions = await transactionService.getUserTransactions(userId, userRole.DOCTOR);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, { transactions }));
    } catch (err) {
      console.error('error in getting transactions for patient', err);
      return next(err);
    }
  }

}
