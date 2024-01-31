import { Types } from "mongoose";
import { meetingStatus } from "../enum/meeting.enum";
import { userCurrency, userRole } from "../enum/user.enum";
import { TimeSlot } from "./schedule.interface";

export interface IMeeting {
    patientId: Types.ObjectId,
    doctorId: Types.ObjectId,
    date: Date, //dd-mm-yy
    timeSlot: TimeSlot
    status: meetingStatus,
    offeringId: Types.ObjectId,
    price: number,
    currency: Types.ObjectId,
    canceledBy? : userRole,
}