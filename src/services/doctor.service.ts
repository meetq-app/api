import { Types } from 'mongoose';
import { timeZoneConvertionType, userRole } from '../enum/user.enum';
import { NotFoundError } from '../errors/not-found.error';
import { IDoctor, IMeeting } from '../interfaces';
import Doctor from '../models/doctor.model';
import { UserService } from './user.service';
import { v4 as uuid } from 'uuid';
import { HelperService } from './helper.service';
import { ISchedule } from '../interfaces/schedule.interface';
import Meeting from '../models/meeting.model';
import Patient from '../models/patient.model';
import { InsufficientDataError } from '../errors';
import { meetingStatus } from '../enum/meeting.enum';
import { sendMail } from './mail.service';
import { IMeetingFilters } from '../interfaces/meeting-filters.interface';
import timezoneService from './timezone.service';
import moment from 'moment';

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

  async update(
    doctorId: Types.ObjectId,
    updateData: Partial<Omit<IDoctor, 'balance' | 'email'>>,
  ): Promise<Partial<IDoctor>> {
    try {
      const doctorToUpdate = await Doctor.findById(doctorId);

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
      const saveBase64Certificates = base64Strings.map((b64) => {
        const filename = `certificate_${uuid()}.png`;
        const filePath = `certificate/${filename}`;
        const absolutePath = `${process.env.SPACE_CDN_ENDPOINT}/${filePath}`;
        certificates.push(absolutePath);
        return HelperService.saveBase64Image(b64, filePath);
      });

      const user = await Doctor.findById(id);
      user.certificates = [...user.certificates, ...certificates];
      await user.save();

      await Promise.allSettled(saveBase64Certificates);
      //@ts-ignore
      return user.certificates;
    } catch (e) {
      throw new Error(e);
    }
  }

  async manageSchedule(
    id: Types.ObjectId,
    schedule: ISchedule,
    timezone: number,
  ): Promise<ISchedule> {
    try {
      const utcSchedule = timezoneService.convertScheduleToUTC(
        schedule,
        timezone,
        timeZoneConvertionType.FROM_TIMEZONE_TO_UTC,
      );
      await this.userModel.findByIdAndUpdate(id, { schedule: utcSchedule });
      return schedule;
    } catch (e) {
      throw new Error(e);
    }
  }

  async manageOfferings(
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
  > {
    try {
      await this.userModel.findByIdAndUpdate(id, { offerings });
      return offerings;
    } catch (e) {
      throw new Error(e);
    }
  }

  async cancelMeeting(userId: string, id: string, reason: string): Promise<IMeeting> {
    const meetingId = new Types.ObjectId(id);
    const meeting = await Meeting.findById(meetingId);
    const patient = await Patient.findById(meeting.patientId);
    const doctor = await Doctor.findById(meeting.doctorId);

    const userObjectId = new Types.ObjectId(userId);
    if (!userObjectId.equals(doctor._id)) {
      throw new InsufficientDataError();
    }

    patient.balance += meeting.price;

    meeting.status = meetingStatus.CANCELED;
    await meeting.save();
    await patient.save();

    sendMail(
      patient.email,
      'Meeting cancelation',
      `${doctor.fullName} has canceled meeting
       on ${meeting.date} with message '${reason}'`,
    );

    return meeting;
  }

  async confirmMeeting(userId: string, id: string): Promise<IMeeting> {
    const meetingId = new Types.ObjectId(id);
    const meeting = await Meeting.findById(meetingId);
    const patient = await Patient.findById(meeting.patientId);
    const doctor = await Doctor.findById(meeting.doctorId);

    const userObjectId = new Types.ObjectId(userId);
    if (!userObjectId.equals(doctor._id)) {
      throw new InsufficientDataError();
    }

    meeting.status = meetingStatus.CONFIRMED;
    await meeting.save();

    sendMail(patient.email, 'Meeting confitmation', `${doctor.fullName} has confirmed teh meeting`);

    return meeting;
  }

  async getMeetings(
    doctorId: Types.ObjectId,
    status: string,
    filters: IMeetingFilters,
    timezone: number,
  ): Promise<Array<IMeeting>> {
    doctorId = new Types.ObjectId(doctorId);

    const pipeline: any = [
      {
        $match: {
          doctorId,
          status,
        },
      },
      {
        $lookup: {
          from: Patient.collection.name,
          localField: 'patientId',
          foreignField: '_id',
          as: 'patient',
        },
      },
      {
        $addFields: {
          patient: { $arrayElemAt: ['$patient', 0] },
        },
      },
      {
        $project: {
          _id: 1,
          patientId: 1,
          date: 1,
          timeSlot: 1,
          price: 1,
          status: 1,
          patient: {
            email: '$patient.email',
            fullName: '$patient.fullName',
            avatar: '$patient.avatar',
            speciality: '$patient.speciality',
          },
        },
      },
    ];

    if (filters.limit) {
      const limitStage = { $limit: +filters.limit };
      pipeline.push(limitStage);
    }

    const meetings = await Meeting.aggregate(pipeline);

    meetings.forEach((meet) => {
      const utcDate = moment(meet.date).add(timezone, 'hours').toDate();
      const dayOfWeek = HelperService.getDayOfWeekFromDate(utcDate);
      const utcSlot = timezoneService.confertToUTCSlot(
        dayOfWeek,
        meet.timeSlot,
        timezone,
        timeZoneConvertionType.FROM_UTC_TO_TIMEZONE,
      );
      
      meet.timeSlot = utcSlot;
      meet.date = utcDate;
    });
    return meetings;
  }
}

export default new DoctorService();
