import { Document, ObjectId, Types } from 'mongoose';
import { IDoctor, IDoctorRaiting, IMeeting, IUserFilters, TimeSlot } from '.';
import { appLanguage } from '../enum/app.enum';
import { userLanguage, userRole } from '../enum/user.enum';
import { IMeetingFilters } from './meeting-filters.interface';
import { IPatient } from './patient.interface';

export interface IPatientService {
  generateJWT(email: string, id: string): string;
  update(
    patientId: Types.ObjectId,
    updateData: Partial<Omit<IPatient, '_id' | 'balance' | 'email'>>,
  ): Promise<Partial<IPatient>>;
  getDoctors(userFilters: IUserFilters, lang: appLanguage): Promise<Partial<IDoctor[]>>;
  getDoctor(id: string, lang: appLanguage): Promise<Partial<IDoctor>>;
  getDoctorsTimeSlotsByDate(id: string, slotsDate: string, timezone: number): Promise<Array<TimeSlot>>;
  bookMeeting(
    patientId: Types.ObjectId,
    doctorId: Types.ObjectId,
    date: Date,
    timeSlot: TimeSlot,
    offeringId: Types.ObjectId,
    timezone: number,
  ): Promise<IMeeting>;
  cancelMeeting(userId: string, id: string, reason: string): Promise<IMeeting>;
  getMeetings(
    patientId: Types.ObjectId,
    status: string,
    filters: IMeetingFilters,
    lang: userLanguage,
  ): Promise<Array<IMeeting>>;
  finishAndRateMeeting(
    userId: string,
    meetingId: string,
    raiting: number,
    comment: string,
  ): Promise<IDoctorRaiting>;
}
