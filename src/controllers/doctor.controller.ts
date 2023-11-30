import { NextFunction, Request, Response } from 'express';
import doctorService from '../services/doctor.service';

const Doctor = require('../models/doctor.model');

export class DoctorController {
  async getDoctorInfo (req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.currentUser;
      const doctor = await doctorService.findUserById(id);
      res.status(200).send(doctor);
    } catch (err) {
      return next(err);
    }
  };

  async updateDoctorInfo (req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.currentUser;
      const updatedDoctor = await doctorService.update(id, req.body);
      res.status(200).send(updatedDoctor);
    } catch (err) {
      return next(err);
    }
  };
}
