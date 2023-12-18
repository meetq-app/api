import mongoose, { Schema } from 'mongoose';
import { IDoctorRaiting } from '../interfaces';

const doctorRaitingSchema = new Schema<IDoctorRaiting>({
  doctorId: { type: Schema.Types.ObjectId, required: true },
  patientId: { type: Schema.Types.ObjectId, required: true },
  raiting: { type: Number },
  comment: { type: String },
});

const DoctorRaiting = mongoose.model('DoctorRaiting', doctorRaitingSchema);

export default DoctorRaiting;
