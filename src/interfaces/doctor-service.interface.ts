import { Document, ObjectId, Types } from 'mongoose';
import { IDoctor, IMeeting } from '.';
import { userRole } from '../enum/user.enum';
import { IMeetingFilters } from './meeting-filters.interface';
import { ISchedule } from './schedule.interface';

export interface IDoctorService {
  generateJWT(email: string, id: string): string;
  update(
    doctorId: Types.ObjectId,
    updateData: Partial<Omit<IDoctor, '_id' | 'balance' | 'email'>>,
  ): Promise<Partial<IDoctor>>;
  addCertificate(id: Types.ObjectId, base64Strings: Array<string>): Promise<string[]>;
  manageSchedule(id: Types.ObjectId, schedule: ISchedule): Promise<ISchedule>;
  manageOfferings(
    id: Types.ObjectId,
    offerings: [
      {
        offerId: Types.ObjectId;
        price: number;
      },
    ],
  ): Promise<
    Array<{
      offerId: Types.ObjectId;
      price: number;
    }>
  >;
  cancelMeeting(userId: string, id: string, reason: string): Promise<IMeeting>;
  confirmMeeting(userId: string, id: string): Promise<IMeeting>;
  getMeetings(
    doctorId: Types.ObjectId,
    status: string,
    filters: IMeetingFilters,
  ): Promise<Array<IMeeting>>;
}
