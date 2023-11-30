import { NextFunction, Request, Response } from 'express';
import patientService from '../services/patient.service';

const Patient = require('../models/patient.model');

export class PatientController {
  async getPatientInfo (req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.currentUser;
      const patient = await patientService.findUserById(id);
      res.status(200).send(patient);
    } catch (err) {
      return next(err);
    }
  };

  async updatePatientInfo (req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.currentUser;
      const updatedPatient = await patientService.update(id, req.body);
      res.status(200).send(updatedPatient);
    } catch (err) {
      return next(err);
    }
  };
}
