import { Types } from 'mongoose';
import { userRole } from '../enum/user.enum';
import { NotFoundError } from '../errors/not-found.error';
import { IDoctor } from '../interfaces/doctor.interface';
import Doctor from '../models/doctor.model';
import { UserService } from './user.service';
import { v4 as uuid } from 'uuid';
import { HelperService } from './helper.service';

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

  async addCertificate(id: Types.ObjectId, base64Strings: Array<string>): Promise<string[]> {
    try {
      const certificates = [];
      const saveNase64Certificates = base64Strings.map((b64) => {
        const filename = `certificate_${uuid()}.png`;
        const filePath = `/img/certificate/${filename}`;
        certificates.push(filePath);
        return HelperService.saveBase64Image(b64, filePath);
      });

      const user = await this.findUserById(id);
      //@ts-ignore
      user.certificates = [...user.certificates, ...certificates];
      await user.save();

      const certificateUrls = await Promise.allSettled(saveNase64Certificates);
      return certificateUrls.map((cert) => ((cert.status === 'fulfilled') ? cert.value : ''));
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default new DoctorService();
