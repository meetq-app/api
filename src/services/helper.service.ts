import { respStatus } from '../enum/response.enum';
import fs from 'fs';
import { join } from 'path';
import { Time, TimeSlot } from '../interfaces';

const AWS = require('aws-sdk');

export class HelperService {
  static generateRandomSixDigitNumber() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  static formatResponse(status: respStatus, body: any) {
    return {
      status,
      body,
    };
  }

  static async saveBase64Image(base64String: string, filePath: string): Promise<string> {

    const spacesEndpoint = new AWS.Endpoint(process.env.SPACE_ENDPOINT); 
    const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.SPACE_ACCESS_KEY_ID,
      secretAccessKey: process.env.SPACE_SECRET_ACCESS_KEY,
    });
    const bucketName = process.env.SPACE_BUCKET_NAME;

    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const imageData = Buffer.from(base64Data, 'base64');

    const uploadParams = {
      Bucket: bucketName,
      Key: filePath, 
      Body: imageData,
      ACL: 'public-read', 
    };

    return new Promise((resolve, rejects) => {
      s3.upload(uploadParams, (err, data) => {
        if (err) {
          rejects(err);
        } else {
          resolve(data.Location);
        }
      });
    });
  }

  static getDayOfWeekFromDate(date: Date): string {
    const dayOfWeek = date.getDay();

    const daysOfWeek = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return daysOfWeek[dayOfWeek];
  }

  static getAvialableTimeSlots(schedule: Array<TimeSlot>, meets: Array<TimeSlot>): Array<TimeSlot> {
    if (meets.length === 0) {
      return schedule.map((s) => ({ from: s.from, to: s.to }));
    }

    const stringifiedSchedule = schedule.map((s) => `${s.from}-${s.to}`);
    const stringifiedMeets = meets.map((m) => `${m.from}-${m.to}`);

    const avialableSlots = stringifiedSchedule.map((timeSlot) => {
      if (!stringifiedMeets.includes(timeSlot)) {
        const [from, to] = timeSlot.split('-');
        return { from, to };
      }
    });

    return avialableSlots.filter(Boolean);
  }

  static checkSlotAvialability(avialableSlots: Array<TimeSlot>, wantedSlot: TimeSlot): boolean {
    const stringifiedSlots = avialableSlots.map((s) => `${s.from}-${s.to}`);
    const stringifiedSlot = `${wantedSlot.from}-${wantedSlot.to}`;

    return stringifiedSlots.includes(stringifiedSlot);
  }

  static checkIfDateFitsBookingRequirments(date: Date, months: number): boolean {
    const today = new Date();
    const isAfterOrEqualToday = date.getTime() >= today.getTime();

    const twoMonthsFromToday = new Date();
    twoMonthsFromToday.setMonth(twoMonthsFromToday.getMonth() + months);

    const isBeforeTwoMonths = date.getTime() < twoMonthsFromToday.getTime();

    if (!isAfterOrEqualToday || !isBeforeTwoMonths) {
      return false;
    }

    return true;
  }

  static generateStartDateTime(givenDate: Date, givenTime: Time): Date {
    const year: number = givenDate.getUTCFullYear();
    const month: number = givenDate.getUTCMonth() + 1;
    const day: number = givenDate.getUTCDate();

    const [hours, minutes] = givenTime.split(':').map(Number);
    const combinedDateTime: Date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    return combinedDateTime;
  }

  static getDateDiffByHour(date1: Date, date2: Date): number {
    const timeDifferenceMs: number = date2.getTime() - date1.getTime();
    const differenceInHours: number = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
    return differenceInHours;
  }
}
