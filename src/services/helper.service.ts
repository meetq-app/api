import { respStatus } from '../enum/response.enum';
import fs from 'fs';
import { join } from 'path';
import { TimeSlot } from '../interfaces';

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
    console.log('filePath', filePath);
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const path = join(__dirname, '../', 'public', filePath);

    console.log('path', path);

    return new Promise((resolve, rejects) => {
      fs.writeFile(path, imageBuffer, 'base64', (err) => {
        if (err) {
          rejects(err);
        } else {
          resolve(filePath);
        }
      });
    });
  }

  static getDayOfWeekFromDate(date: Date): string {
    const dayOfWeek = date.getDay();

    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
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
}
