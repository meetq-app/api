import { NextFunction, Request, Response } from 'express';
import { respStatus } from '../enum/response.enum';
import { IUserFilters } from '../interfaces';
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

  async getDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.currentUser;
      //@ts-ignore
      if(req.query.languages) req.query.languages = JSON.parse(req.query.languages);
      // @ts-ignore
      if(req.query.offerings) req.query.offerings = JSON.parse(req.query.offerings);
      //@ts-ignore
      const doctors = await patientService.getDoctors(req.query as IUserFilters); //TODO temp solution untill impliment validatitions
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, {doctors}));
    } catch (err) {
      console.log(req.query);
      console.error('error in getting doctors ctrl', err);
      return next(err);
    }
  }

  async getDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: doctorId } = req.params;
      const lang = req.lang;
      const doctor = await patientService.getDoctor(doctorId, lang);
      res.status(200).send(HelperService.formatResponse(respStatus.SUCCESS, {doctor}));
    } catch (err) {
      console.log(req.query);
      console.error('error in getting doctors ctrl', err);
      return next(err);
    }
  }
}
