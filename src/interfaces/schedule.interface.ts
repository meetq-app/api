export type Time = string;
export type TimeSlot = {from: Time, to: Time};

export interface ISchedule {
  sunday: TimeSlot[];
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
};