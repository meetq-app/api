import { timeZoneConvertionType } from '../enum/user.enum';
import { TimeSlot } from '../interfaces';
import { daysOfWeek, ISchedule } from '../interfaces/schedule.interface';

class TimezoneService {
  confertToUTCSlot(
    dayOfWeek: string,
    slot: TimeSlot,
    timezone: number,
    type: timeZoneConvertionType,
  ): {
    slot: TimeSlot;
    dayOfWeek: string;
  } {
    if (timezone === 0) {
      return { dayOfWeek, slot };
    }

    const startTime = parseInt(slot.from.split(':')[0]);
    const startMinute = slot.from.split(':')[1];
    const endTime = parseInt(slot.to.split(':')[0]);
    const endMinute = slot.to.split(':')[1];

    let utcStartTime;
    let utcEndTime;

    if (type === timeZoneConvertionType.FROM_TIMEZONE_TO_UTC) {
      utcStartTime = startTime - timezone;
      utcEndTime = endTime - timezone;
    } else {
      utcStartTime = startTime + timezone;
      utcEndTime = endTime + timezone;
    }

    if (utcStartTime >= 24) {
      utcStartTime -= 24;
      let curDayNumber = daysOfWeek.indexOf(dayOfWeek);
      curDayNumber++;
      if (curDayNumber === 7) {
        curDayNumber = 0;
      }

      dayOfWeek = daysOfWeek[curDayNumber];
    }

    if (utcStartTime < 0) {
      utcStartTime += 24;
      let curDayNumber = daysOfWeek.indexOf(dayOfWeek);
      curDayNumber--;
      if (curDayNumber === -1) {
        curDayNumber = 6;
      }

      dayOfWeek = daysOfWeek[curDayNumber];
    }

    if (utcEndTime >= 24) {
      utcEndTime -= 24;
    }

    if (utcEndTime < 0) {
      utcEndTime += 24;
    }

    utcStartTime = utcStartTime < 10 ? `0${utcStartTime}` : utcStartTime;
    utcEndTime = utcEndTime < 10 ? `0${utcEndTime}` : utcEndTime;

    const utcSlot: TimeSlot = {
      from: `${utcStartTime}:${startMinute}`,
      to: `${utcEndTime}:${endMinute}`,
    };

    return { dayOfWeek, slot: utcSlot };
  }

  convertScheduleToUTC(schedule: ISchedule, timezone: number, type: timeZoneConvertionType): ISchedule {
    const utcSchedule = {};

    Object.entries(schedule).forEach(([key, val]) => {
      val.forEach((slot) => {
        const utcSlot = this.confertToUTCSlot(key, slot, timezone, type);
        if (!utcSchedule[utcSlot.dayOfWeek]) {
          utcSchedule[utcSlot.dayOfWeek] = [];
        }
        utcSchedule[utcSlot.dayOfWeek].push(utcSlot.slot);
      });
    });

    return utcSchedule;
  }
}

export default new TimezoneService()