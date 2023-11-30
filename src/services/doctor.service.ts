import { Types } from 'mongoose';
import { userRole } from '../enum/user.enum';
import { NotFoundError } from '../errors/not-found.error';
import { IDoctor } from '../interfaces/doctor.interface';
import Doctor from '../models/doctor.model';
import { UserService } from './user.service';

class DoctorService extends UserService {
  userModel;

  constructor(userModel = Doctor) {
    super();
    this.userModel = userModel;
  }

  generateJWT(email: string, id: string): string {
    const jwt = super.generateJWT(email, id, userRole.DOCTOR);
    return jwt;
  }

  async update(doctorId: Types.ObjectId, updateData: Partial<Omit<IDoctor, 'balance' | 'email'>>): Promise<Partial<IDoctor>> {
    try {
      const doctorToUpdate = await this.findUserById(doctorId);

      if (!doctorToUpdate) {
        throw new NotFoundError();
      }

      const { ...allowedUpdates } = updateData;
      Object.assign(doctorToUpdate, allowedUpdates);

      const updatedDoctor = await doctorToUpdate.save();
      return updatedDoctor;
    } catch (error) {
      // Handle error
      console.error(error);
      throw error;
    }
  }
}

export default new DoctorService();
