import { NextFunction, Request, Response } from 'express';
import { respStatus } from '../enum/response.enum';
import doctorService from '../services/doctor.service';
import { HelperService } from '../services/helper.service';

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

}
