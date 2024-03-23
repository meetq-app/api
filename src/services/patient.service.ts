import moment from 'moment';
import { Types } from 'mongoose';
import constants from '../constants';
import { appLanguage } from '../enum/app.enum';
import { meetingStatus } from '../enum/meeting.enum';
import { timeZoneConvertionType, userLanguage, userRole } from '../enum/user.enum';
import { InsufficientDataError, InvalidCreedentialsdError } from '../errors';
import { NotFoundError } from '../errors/not-found.error';
import { IDoctorRaiting, IPatient, IUserFilters, TimeSlot, IDoctor, IMeeting } from '../interfaces';
import { IMeetingFilters } from '../interfaces/meeting-filters.interface';
import { IPatientService } from '../interfaces/patient-service.interface';
import Country from '../models/country.model';
import Currency from '../models/currency.model';
import DoctorRaiting from '../models/doctor-raiting.model';
import Doctor from '../models/doctor.model';
import Language from '../models/language.model';
import Meeting from '../models/meeting.model';
import Offering from '../models/offering.model';
import Patient from '../models/patient.model';
import couponService from './coupon.service';
import { HelperService } from './helper.service';
import { sendMail } from './mail.service';
import timezoneService from './timezone.service';
import transactionService from './transaction.service';
import { UserService } from './user.service';

class PatientService extends UserService implements IPatientService {
  userModel;

  constructor(userModel = Patient) {
    super();
    this.userModel = userModel;
  }

  generateJWT(email: string, id: string): string {
    const jwt = super.generateJWT(email, id, userRole.PATIENT);
    return jwt;
  }

  async update(
    patientId: Types.ObjectId,
    updateData: Partial<Omit<IPatient, '_id' | 'balance' | 'email'>>,
  ): Promise<Partial<IPatient>> {
    try {
      const patientToUpdate = await Patient.findById(patientId);

      if (!patientId) {
        throw new NotFoundError();
      }

      const { ...allowedUpdates } = updateData;
      Object.assign(patientToUpdate, allowedUpdates);

      const updatedPatient = await patientToUpdate.save();
      return updatedPatient;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getDoctors(
    userFilters: IUserFilters,
    lang: appLanguage = appLanguage.EN,
  ): Promise<Partial<IDoctor[]>> {
    try {
      const matchConditions = {};
      console.log('userFilters', userFilters);

      if (userFilters.speciality) {
        matchConditions['speciality'] = userFilters.speciality;
      }

      if (userFilters.languages && userFilters.languages.length > 0) {
        const languages = userFilters.languages.map((l) => new Types.ObjectId(l));
        matchConditions['languages'] = { $in: languages };
      }

      if (userFilters.offerings && userFilters.offerings.length > 0) {
        matchConditions['offerings.offerId'] = { $in: userFilters.offerings };
      }

      if (userFilters.search) {
        matchConditions['$or'] = [
          { fullName: { $regex: userFilters.search, $options: 'i' } },
          { speciality: { $regex: userFilters.search, $options: 'i' } },
        ];
      }

      const pipeline: any = [
        {
          $match: {
            activeStatus: 1,
            fullName: { $exists: true },
            speciality: { $exists: true },
            ...matchConditions,
          },
        },
        {
          $lookup: {
            from: Language.collection.name,
            localField: 'languages',
            foreignField: '_id',
            as: 'languages',
          },
        },
        {
          $lookup: {
            from: Country.collection.name,
            localField: 'country',
            foreignField: '_id',
            as: 'country',
          },
        },
        {
          $unwind: { path: '$languages', preserveNullAndEmptyArrays: true },
        },
        {
          $unwind: { path: '$country', preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            _id: 1,
            avatar: 1,
            fullName: 1,
            raiting: 1,
            raitedCount: 1,
            gender: 1,
            country: {
              $cond: {
                if: { $eq: [{ $ifNull: ['$country', null] }, null] },
                then: null,
                else: {
                  _id: '$country._id',
                  name: `$country.name.${lang}`,
                  countryCode: '$country.countryCode',
                },
              },
            },
            timezone: 1,
            languages: { $ifNull: ['$languages', null] },
            speciality: 1,
          },
        },
      ];

      pipeline.push({
        $group: {
          _id: '$_id',
          avatar: { $first: '$avatar' },
          fullName: { $first: '$fullName' },
          raiting: { $first: '$raiting' },
          raitedCount: { $first: '$raitedCount' },
          gender: { $first: '$gender' },
          country: { $first: '$country' },
          timezone: { $first: '$timezone' },
          speciality: { $first: '$speciality' },
          languages: { $push: '$languages' },
        },
      });

      const sortField = userFilters.sortField ? userFilters.sortField : 'raiting';

      if (userFilters.sort) {
        const sortDirection = userFilters.sort === 'ASC' ? 1 : -1;
        const sortStage = { $sort: { [sortField]: sortDirection } };
        pipeline.push(sortStage);
      }

      if (userFilters.limit) {
        const limitStage = { $limit: +userFilters.limit };
        pipeline.push(limitStage);
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
          $lookup: {
            from: Language.collection.name,
            localField: 'languages',
            foreignField: '_id',
            as: 'languages',
          },
        },
        {
          $lookup: {
            from: Country.collection.name,
            localField: 'country',
            foreignField: '_id',
            as: 'country',
          },
        },
        {
          $unwind: { path: '$languages', preserveNullAndEmptyArrays: true },
        },
        {
          $unwind: { path: '$country', preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            _id: 1,
            avatar: 1,
            fullName: 1,
            raiting: 1,
            raitedCount: 1,
            gender: 1,
            country: {
              $cond: {
                if: { $eq: [{ $ifNull: ['$country', null] }, null] },
                then: null,
                else: {
                  _id: '$country._id',
                  name: `$country.name.${lang}`,
                  countryCode: '$country.countryCode',
                },
              },
            },
            timezone: 1,
            speciality: 1,
            certificates: 1,
            languages: { $ifNull: ['$languages', null] },
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
                  price: '$$offering.price',
                  offer: {
                    _id: '$$offering._id',
                    name: `$$offering.name.${lang}`,
                    description: `$$offering.description.${lang}`,
                  },
                  currency: {
                    // TODO calculate currency accordingly, get Data from XE api
                    _id: '65b61d7a8db4edc72edb9361',
                    code: 'AMD',
                    symbol: '֏',
                  },
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
            raitedCount: { $first: '$raitedCount' },
            gender: { $first: '$gender' },
            country: { $first: '$country' },
            timezone: { $first: '$timezone' },
            certificates: { $first: '$certificates' },
            speciality: { $first: '$speciality' },
            languages: { $push: '$languages' },
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

  async getDoctorsTimeSlotsByDate(
    id: string,
    slotsDate: string,
    timezone: number,
  ): Promise<Array<TimeSlot>> {
    const doctorId = new Types.ObjectId(id);
    const startDate = new Date(slotsDate);
    const endDate = new Date(slotsDate);
    endDate.setDate(endDate.getDate() + 1);
    const dayOfWeek = HelperService.getDayOfWeekFromDate(startDate);

    console.log({ doctorId, startDate, endDate });

    const meetings = await Meeting.find({
      doctorId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
      status: { $ne: meetingStatus.CANCELED },
    });
    const doctor = await Doctor.findById(doctorId);
    const utcSchedule = timezoneService.convertScheduleToUTC(
      doctor.schedule,
      timezone,
      timeZoneConvertionType.FROM_UTC_TO_TIMEZONE,
    );
    const schedule = utcSchedule[dayOfWeek];
    if (schedule.length === 0) {
      return [];
    }
    const bookedTimeSlots = meetings.map((m) => m.timeSlot);
    console.log({ meetings, schedule, bookedTimeSlots, doctorId });

    const bookedTimeSlotsInUTC = bookedTimeSlots.map((slot) =>
      timezoneService.confertToUTCSlot(
        dayOfWeek,
        slot,
        timezone,
        timeZoneConvertionType.FROM_UTC_TO_TIMEZONE,
      ).slot
    );

    const avialableTimeSlots = HelperService.getAvialableTimeSlots(schedule, bookedTimeSlotsInUTC);
    return avialableTimeSlots;
  }

  async bookMeeting(
    patientId: Types.ObjectId,
    doctorId: Types.ObjectId,
    date: Date,
    timeSlot: TimeSlot,
    offeringId: Types.ObjectId,
    timezone: number,
  ): Promise<IMeeting> {
    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    console.log(doctor.offerings, offeringId);

    const offering = doctor.offerings.find((o) => o.offerId.equals(offeringId));
    console.log({ offering });
    if (!offering) {
      throw new InvalidCreedentialsdError('Invalid Offering ID');
    }

    const isDateFitsRequirment = HelperService.checkIfDateFitsBookingRequirments(date, 2);

    if (!isDateFitsRequirment) {
      throw new InsufficientDataError('insufficient date', []);
    }

    if (patient.balance < offering.price) {
      // TODO convert between curencies
      throw new InsufficientDataError('insufficient balance', []);
    }

    const avialableSlots = await this.getDoctorsTimeSlotsByDate(
      doctorId.toString(),
      date.toISOString().slice(0, 10),
      timezone,
    );

    const dayOfWeek = HelperService.getDayOfWeekFromDate(date);
    const utcTimeSlot = timezoneService.confertToUTCSlot(
      dayOfWeek,
      timeSlot,
      timezone,
      timeZoneConvertionType.FROM_TIMEZONE_TO_UTC,
    );
    console.log({ avialableSlots, timeSlot, utcTimeSlot: utcTimeSlot.slot });
    const isSlotAvialable = HelperService.checkSlotAvialability(avialableSlots, timeSlot);

    if (!isSlotAvialable) {
      throw new InsufficientDataError('insufficient time slot', []);
    }

    await transactionService.patientToDoctorTransaction(patient, doctor, offering.price);

    const startDate = HelperService.generateStartDateTime(date, timeSlot.from, timezone);

    const meeting = new Meeting({
      patientId,
      doctorId,
      date: startDate,
      timeSlot: utcTimeSlot.slot,
      offeringId,
      price: offering.price,
      currency: doctor.currency,
    });

    await meeting.save();

    const dateInDoctorsTimezone = moment(startDate).add(-5, 'hours').toDate() //Todo users doctors timezone
    console.log({startDate, dateInDoctorsTimezone})
    sendMail(
      doctor.email,
      'Meeting Booking',
      `${patient.fullName} has booked a meeting
       on ${dateInDoctorsTimezone.toString()} at UTC ${-5}`, 
    );

    return meeting;
  }

  async cancelMeeting(userId: string, id: string, reason: string): Promise<IMeeting> {
    const meetingId = new Types.ObjectId(id);
    const meeting = await Meeting.findById(meetingId);
    const patient = await Patient.findById(meeting.patientId);
    const doctor = await Doctor.findById(meeting.doctorId);

    const userObjectId = new Types.ObjectId(userId);
    if (!userObjectId.equals(patient._id)) {
      throw new InsufficientDataError();
    }

    const timeDiff = HelperService.getDateDiffByHour(new Date(), meeting.date);
    if (
      timeDiff < constants.ALLOWED_CANCELATION_TIME &&
      meeting.status === meetingStatus.CONFIRMED
    ) {
      // TODO create transaction transaction, inject transaction service
      patient.balance += meeting.price / 2;
      doctor.balance += meeting.price / 2;
    } else {
      patient.balance += meeting.price;
    }

    meeting.status = meetingStatus.CANCELED;
    await meeting.save();
    await patient.save();
    await doctor.save();

    sendMail(
      doctor.email,
      'Meeting cancelation',
      `${patient.fullName} has canceled meeting
       on ${meeting.date} with message '${reason}'`,
    );

    return meeting;
  }

  async getMeetings(
    patientId: Types.ObjectId,
    status: string,
    filters: IMeetingFilters,
    userLanguage: userLanguage,
  ): Promise<Array<IMeeting>> {
    patientId = new Types.ObjectId(patientId);

    const pipeline: any = [
      {
        $match: {
          patientId,
          status,
        },
      },
      {
        $lookup: {
          from: Doctor.collection.name,
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      {
        $lookup: {
          from: Offering.collection.name,
          localField: 'offeringId',
          foreignField: '_id',
          as: 'offering',
        },
      },
      {
        $lookup: {
          from: Currency.collection.name,
          localField: 'currency',
          foreignField: '_id',
          as: 'currency',
        },
      },
      {
        $addFields: {
          doctor: { $arrayElemAt: ['$doctor', 0] },
          offering: { $arrayElemAt: ['$offering', 0] },
        },
      },
      {
        $unwind: '$currency',
      },
      {
        $project: {
          _id: 1,
          patientId: 1,
          date: 1,
          timeSlot: 1,
          price: { $toString: '$price' },
          status: 1,
          currency: '$currency',
          offering: {
            _id: '$offering._id',
            name: `$offering.name.${userLanguage}`,
            description: `$offering.description.${userLanguage}`,
          },
          doctor: {
            _id: '$doctor._id',
            email: '$doctor.email',
            fullName: '$doctor.fullName',
            avatar: '$doctor.avatar',
            speciality: '$doctor.speciality',
            raiting: '$doctor.raiting',
            raitedCount: '$doctor.raitedCount',
            gender: '$doctor.gender',
            country: '$doctor.country',
            timezone: '$doctor.timezone',
            languages: {
              $map: {
                input: '$doctor.languages',
                as: 'lang',
                in: { _id: '$$lang' },
              },
            },
          },
        },
      },
    ];

    let sortStage = { $sort: { date: -1 } };

    if (filters.sort && filters.sort === 'ASC') {
      sortStage = { $sort: { date: 1 } };
    }
    pipeline.push(sortStage);

    if (filters.limit) {
      const limitStage = { $limit: +filters.limit };
      pipeline.push(limitStage);
    }

    const meetings = await Meeting.aggregate(pipeline);
    return meetings;
  }

  async finishAndRateMeeting(
    userId: string,
    meetingId: string,
    raiting: number,
    comment: string,
  ): Promise<IDoctorRaiting> {
    const patientObjectId = new Types.ObjectId(userId);
    const meetingObjectId = new Types.ObjectId(meetingId);

    const meeting = await Meeting.findById(meetingObjectId);
    const doctor = await Doctor.findById(meeting.doctorId);

    if (!patientObjectId.equals(meeting.patientId)) {
      throw new InsufficientDataError();
    }

    const currentRaiting = doctor.raiting;
    let raitedCount = doctor.raitedCount || 1;

    const newRaiting = (currentRaiting * raitedCount + raiting) / (raitedCount + 1);
    doctor.raitedCount++;
    doctor.raiting = newRaiting;
    await doctor.save();

    meeting.status = meetingStatus.FINISHED;
    await meeting.save();

    const doctorRaiting = new DoctorRaiting({
      doctorId: doctor._id,
      patientId: patientObjectId,
      raiting,
      comment,
    });

    await doctorRaiting.save();
    return doctorRaiting;
  }

  async applyCoupon(patientID: Types.ObjectId, code: string): Promise<string> {
    const patient = await Patient.findById(patientID);
    const ammount = await couponService.applyCoupon(code, patient);
    return ammount;
  }
}

export default new PatientService();
