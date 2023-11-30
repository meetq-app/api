import { NOTFOUND } from 'dns';
import { Types } from 'mongoose';
import { userRole } from '../enum/user.enum';
import { NotFoundError } from '../errors/not-found.error';
import { IPatient } from '../interfaces';
import Patient from '../models/patient.model';
import { UserService } from './user.service';

class PatientService extends UserService {
  userModel;

  constructor(userModel = Patient) {
    super();
    this.userModel = userModel;
  }

  generateJWT(email: string, id: string): string {
    const jwt = super.generateJWT(email, id, userRole.PATIENT);
    return jwt;
  }

  async update(patientId: Types.ObjectId, updateData: Partial<Omit<IPatient, 'balance' | 'email'>>): Promise<Partial<IPatient>> {
    try {
      const patientIdToUpdate = await this.findUserById(patientId);

      if (!patientId) {
        throw new NotFoundError();
      }

      const { ...allowedUpdates } = updateData;
      Object.assign(patientIdToUpdate, allowedUpdates);

      const updatedPatient = await patientIdToUpdate.save();
      return updatedPatient;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new PatientService();
