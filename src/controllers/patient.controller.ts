import { NextFunction, Request, Response } from 'express';
import { respStatus } from '../enum/response.enum';
import { HelperService } from '../services/helper.service';
import patientService from '../services/patient.service';

const Patient = require('../models/patient.model');
export class PatientController {
  async getPatientInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.currentUser;
      const patient = await patientService.findUserById(id);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, {patient}));
    } catch (err) {
      return next(err);
    }
  }

  async updatePatientInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.currentUser;
      const updatedPatient = await patientService.update(id, req.body);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, {patient: updatedPatient}));
    } catch (err) {
      return next(err);
    }
  }

  async updatePatientAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.currentUser;
      const { avatar } = req.body;

      const avatarPath = await patientService.updateAvatar(id, avatar);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, {avatar: avatarPath}));
    } catch (err) {
      return next(err);
    }
  }
}
