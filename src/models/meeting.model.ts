import mongoose, { Schema } from 'mongoose';
import { meetingStatus } from '../enum/meeting.enum';
import { IMeeting } from '../interfaces/meeting.interface';

const meetingSchema = new Schema<IMeeting>({
  patientId: Schema.Types.ObjectId,
  doctorId: Schema.Types.ObjectId,
  date: Date,
  timeSlot: { from: String, to: String },
  status: { type: String, default: meetingStatus.BOOKED },
  offeringId: Schema.Types.ObjectId,
  price: Number,
  currency: Schema.Types.ObjectId,
  canceledBy: String,
});

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;
