import { Types } from 'mongoose';
import { appLanguage } from '../enum/app.enum';
import { meetingStatus } from '../enum/meeting.enum';
import { userRole } from '../enum/user.enum';
import { InsufficientDataError } from '../errors';
import { NotFoundError } from '../errors/not-found.error';
import { IPatient, IUserFilters, TimeSlot } from '../interfaces';
import { IDoctor } from '../interfaces/doctor.interface';
import { IMeeting } from '../interfaces/meeting.interface';
import Doctor from '../models/doctor.model';
import Meeting from '../models/meeting.model';
import Offering from '../models/offering.model';
import Patient from '../models/patient.model';
import { HelperService } from './helper.service';
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
        matchConditions['$or'] = [{ fullName: { $regex: userFilters.search, $options: 'i' } }, { speciality: { $regex: userFilters.search, $options: 'i' } }];
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

  async getDoctor(id: string, lang: appLanguage): Promise<Partial<IDoctor>> {
    try {
      const doctorId = new Types.ObjectId(id);
      const doctor = await Doctor.aggregate([
        {
          $match: {
            _id: doctorId,
          },
        },
        {
          $lookup: {
            from: Offering.collection.name,
            localField: 'offerings.offerId',
            foreignField: '_id',
            as: 'matchedOfferings',
          },
        },
        {
          $project: {
            _id: 1,
            avatar: 1,
            fullName: 1,
            raiting: 1,
            gender: 1,
            country: 1,
            timezone: 1,
            currency: 1,
            speciality: 1,
            certificates: 1,
            languages: 1,
            info: 1,
            offerings: {
              $map: {
                input: '$offerings',
                as: 'offer',
                in: {
                  $mergeObjects: [
                    '$$offer',
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$matchedOfferings',
                            cond: { $eq: ['$$this._id', '$$offer.offerId'] },
                          },
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $addFields: {
            offerings: {
              $map: {
                input: '$offerings',
                as: 'offering',
                in: {
                  _id: '$$offering._id',
                  price: '$$offering.price',
                  name: `$$offering.name.${lang}`,
                  description: `$$offering.description.${lang}`,
                },
              },
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            avatar: { $first: '$avatar' },
            fullName: { $first: '$fullName' },
            raiting: { $first: '$raiting' },
            speciality: { $first: '$speciality' },
            languages: { $first: '$languages' },
            info: { $first: '$info' },
            offerings: { $first: '$offerings' },
          },
        },
      ]).exec();

      return doctor[0];
    } catch (err) {
      console.error('error in getting doctors', err);
      throw err;
    }
  }

  async getDoctorsTimeSlotsByDate(id: string, slotsDate: string): Promise<Array<TimeSlot>> {
    const doctorId = new Types.ObjectId(id);
    const date = new Date(slotsDate);
    const dayOfWeek = HelperService.getDayOfWeekFromDate(date);

    const meetings = await Meeting.find({ doctorId, date, status: { $ne: meetingStatus.CANCELED } });
    const doctor = await Doctor.findById(doctorId);
    const schedule = doctor.schedule[dayOfWeek];
    if (schedule.length === 0) {
      return [];
    }
    const bookedTimeSlots = meetings.map((m) => m.timeSlot);
    console.log({meetings, schedule, bookedTimeSlots, date, doctorId });

    const avialableTimeSlots = HelperService.getAvialableTimeSlots(schedule, bookedTimeSlots);
    return avialableTimeSlots;
  }

  async bookMeeting(patientId: Types.ObjectId, doctorId: Types.ObjectId, date: Date, timeSlot: TimeSlot, offeringId: Types.ObjectId): Promise<IMeeting> {
    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    console.log(doctor.offerings, offeringId);

    const offering  = doctor.offerings.find(o => o.offerId.equals(offeringId));
    console.log({offering});

    const isDateFitsRequirment = HelperService.checkIfDateFitsBookingRequirments(date, 2);

    if(!isDateFitsRequirment){
      throw new InsufficientDataError('insufficient date', []);
    }

    if(patient.balance < offering.price){ // TODO convert between curencies
      throw new InsufficientDataError('insufficient balance', []);
    }

    const avialableSlots = await this.getDoctorsTimeSlotsByDate(doctorId.toString(), date.toISOString().slice(0, 10));
    console.log({avialableSlots, timeSlot});
    const isSlotAvialable = HelperService.checkSlotAvialability(avialableSlots, timeSlot);

    if(!isSlotAvialable){
      throw new InsufficientDataError('insufficient time slot', []);
    }

    // create transaction reduce patient balace
    // add new record in transactions collection

    const meeting = new Meeting({
      patientId,
      doctorId,
      date,
      timeSlot,
      offeringId,
      price: offering.price,
      currency: doctor.currency,
    })

    await meeting.save();
    return meeting;
  }
}

export default new PatientService();
