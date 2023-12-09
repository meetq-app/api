import { NOTFOUND } from 'dns';
import { Types } from 'mongoose';
import { userRole } from '../enum/user.enum';
import { NotFoundError } from '../errors/not-found.error';
import { IPatient, IUserFilters } from '../interfaces';
import { IDoctor } from '../interfaces/doctor.interface';
import Doctor from '../models/doctor.model';
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

  async getDoctors(userFilters: IUserFilters): Promise<Partial<IDoctor[]>> {
    try {
      const matchConditions = {};

      if (userFilters.speciality) {
        matchConditions['speciality'] = userFilters.speciality;
      }

      if (userFilters.languages && userFilters.languages.length > 0) {
        matchConditions['languages'] = { $in: userFilters.languages };
      }

      if (userFilters.offerings && userFilters.offerings.length > 0) {
        matchConditions['offerings.offerId'] = { $in: userFilters.offerings };
      }

      if (userFilters.search) {
        matchConditions['$or'] = [
          { fullName: { $regex: userFilters.search, $options: 'i' } }, 
          { speciality: { $regex: userFilters.search, $options: 'i' } }
        ];
      }

      const pipeline = [
        {
          $match: {
            activeStatus: 1,
            fullName: { $exists: true },
            speciality: { $exists: true },
            ...matchConditions,
          },
        },
        {
          $project: {
            _id: 1,
            avatar: 1,
            fullName: 1,
            raiting: 1,
            speciality: 1,
          },
        },
      ];

      const sortField = userFilters.sortField ? userFilters.sortField : 'raiting';

      if (userFilters.sort) {
        const sortDirection = userFilters.sort === 'ASC' ? 1 : -1;
        const sortStage = { $sort: { [sortField]: sortDirection } };
        //@ts-ignore
        pipeline.push(sortStage);
      }

      const doctors = Doctor.aggregate(pipeline);
      return doctors;
    } catch (err) {
      console.error('error in getting doctors', err);
      throw err;
    }
  }
}

export default new PatientService();
