import { Types } from 'mongoose';

export interface IDoctorRaiting {
    doctorId: Types.ObjectId;
    patientId: Types.ObjectId;
    raiting?: number;
    comment?: string
}