type Time = string & { format: "HH:MM" };

export interface ISchedule {
  sunday: { from: Time; to: Time }[];
  monday: { from: Time; to: Time }[];
  tuesday: { from: Time; to: Time }[];
  wednesday: { from: Time; to: Time }[];
  thursday: { from: Time; to: Time }[];
  friday: { from: Time; to: Time }[];
  saturday: { from: Time; to: Time }[];
};