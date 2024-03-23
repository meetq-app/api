// const matrix1 = [
//   [1, 1, 1, 0, 0, 0],
//   [0, 1, 1, 0, 0, 0],
//   [0, 0, 0, 1, 1, 0],
//   [0, 1, 1, 0, 1, 0],
// ];

// function findObjects(matrix) {
//   const objectsCount = 0;
//   const visitedList = [];

//   for (let i = 0; i < matrix.length; i++) {
//     for (let j = 0; j < matrix[0].length; j++) {
//       let count = traverse(matrix, 0, 0, visitedList);
//       if (count > 0) objectsCount++;
//     }
//   }

//   return objectsCount;
// }

// function traverse(matrix, i, j, visitedList, count = 0) {
//   if (matrix[i][j] === 0 || visitedList[`${i}${j}`]) return count;

//   if (matrix[i][j] === 1) {
//     count++;
//     visitedList.push(`${i}${j}`);
//     traverse(matrix, i, j + 1, visitedList, count);
//     traverse(matrix, i + 1, j, visitedList, count);
//   }
// }

// console.log(findObjects(matrix1));

const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function confertToUTCSlot(dayOfWeek, slot, timezone, type) { // fromTimezoneToUTC || fromUTCToTimezone
  if (timezone === 0) {
    return { dayOfWeek, slot };
  }

  const startTime = parseInt(slot.from.split(':')[0]);
  const startMinute = slot.from.split(':')[1];
  const endTime = parseInt(slot.to.split(':')[0]);
  const endMinute = slot.to.split(':')[1];

  let utcStartTime;
  let utcEndTime;

  if(type === 'fromTimezoneToUTC' ){
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
  const utcSlot = {
    from: `${utcStartTime}:${startMinute}`,
    to: `${utcEndTime}:${endMinute}`,
  };

  return { dayOfWeek, slot: utcSlot };
}

// console.log(confertToUTCSlot("monday", {"from": "09:00", "to": "10:00"}, -5))
// console.log(confertToUTCSlot("monday", {"from": "22:00", "to": "23:00"}, -5))
// console.log(confertToUTCSlot("monday", {"from": "22:00", "to": "23:00"}, -5))
// console.log(confertToUTCSlot("monday", {"from": "01:00", "to": "02:00"}, 4))
// console.log(confertToUTCSlot("sunday", {"from": "01:00", "to": "02:00"}, 4))
// console.log(confertToUTCSlot("monday", {"from": "10:00", "to": "11:00"}, 4))
// console.log(confertToUTCSlot("monday", {"from": "10:00", "to": "11:00"}, 0))

const schedule = JSON.parse(`{
  "sunday": [{ "from": "01:00", "to": "02:00" }, { "from": "09:00", "to": "10:00" }, { "from": "10:30", "to": "11:30" }],
  "monday": [{ "from": "09:00", "to": "10:00" }, { "from": "10:30", "to": "11:30" }],
  "tuesday": [{ "from": "09:00", "to": "10:00" }, { "from": "10:30", "to": "11:30" }],
  "wednesday": [{ "from": "09:00", "to": "10:00" }, { "from": "10:30", "to": "11:30" }, { "from": "12:00", "to": "13:00" }, { "from": "13:00", "to": "14:00" }, { "from": "14:00", "to": "15:00" }, { "from": "22:00", "to": "23:00" }]
}`);

// console.log(schedule);

function convertScheduleToUTC(schedule, timezone, type) {
  const utcSchedule = {};

  Object.entries(schedule).forEach(([key, val]) => {
    val.forEach((slot) => {
      const utcSlot = confertToUTCSlot(key, slot, timezone, type);
      if (!utcSchedule[utcSlot.dayOfWeek]) {
        utcSchedule[utcSlot.dayOfWeek] = [];
      }
      utcSchedule[utcSlot.dayOfWeek].push(utcSlot.slot);
    });
  });

  return utcSchedule;
}

console.log(convertScheduleToUTC(schedule, -5, 'fromUTCToTimezone'))
