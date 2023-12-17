const schedule = [
  { from: '9:00', to: '10:00' },
  { from: '10:30', to: '11:30' },
  { from: '12:00', to: '13:00' },
  { from: '14:00', to: '15:00' },
];

const meets = [
  { from: '10:30', to: '11:30' },
  { from: '12:00', to: '13:00' },
];

function getAvialableTimeSlot(schedule, meets) {
  const stringifiedSchedule = schedule.map((s) => `${s.from}-${s.to}`);
  const stringifiedMeets = meets.map((m) => `${m.from}-${m.to}`);
  console.log(stringifiedSchedule, stringifiedMeets);
  const avialableSlots = stringifiedSchedule.map((timeSlot) => {
    if (!stringifiedMeets.includes(timeSlot)) {
      const [from, to] = timeSlot.split('-');
      return { from, to };
    }
  });
  return avialableSlots.filter(Boolean);
}

console.log(getAvialableTimeSlot(schedule, meets));
