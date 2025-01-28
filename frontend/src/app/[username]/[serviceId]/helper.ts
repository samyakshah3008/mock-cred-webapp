import {
  addDays,
  addMinutes,
  format,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";

export function prepareAvailableDays(userAvaibility: any, duration: any) {
  if (!userAvaibility) {
    return [];
  }

  const startDate = startOfDay(new Date());
  const endDate = addDays(startDate, 30);

  const availableDates = [];

  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const dayOfWeek = format(date, "EEEE").toLowerCase();
    const dayAvailability = userAvaibility[dayOfWeek];

    if (dayAvailability && dayAvailability?.isAvailable) {
      const dateStr = format(date, "yyyy-MM-dd");

      const slots = generateAvailableTimeSlots(
        dayAvailability.startTime,
        dayAvailability.endTime,
        duration,
        dateStr,
        userAvaibility?.timeGap
      );

      availableDates.push({
        date: dateStr,
        slots,
      });
    }
  }

  return availableDates;
}

function generateAvailableTimeSlots(
  startTime: string,
  endTime: string,
  duration: number,
  dateStr: string,
  timeGap = 0
) {
  const slots = [];

  const startDateTime = parseISO(`${dateStr}T${startTime}`);
  const endDateTime = parseISO(`${dateStr}T${endTime}`);

  let currentTime = startDateTime;

  const now = new Date();
  if (format(now, "yyyy-MM-dd") === dateStr) {
    currentTime = isBefore(currentTime, now)
      ? addMinutes(now, timeGap)
      : currentTime;
  }

  while (currentTime < endDateTime) {
    const slotEnd = addMinutes(currentTime, duration);

    if (slotEnd <= endDateTime) {
      slots.push(format(currentTime, "HH:mm"));
    }

    currentTime = addMinutes(currentTime, duration + timeGap);
  }

  return slots;
}

// const isSlotAvailable = !bookings.some((booking) => {
//   const bookingStart = booking.startTime;
//   const bookingEnd = booking.endTime;
//   return (
//     (currentTime >= bookingStart && currentTime < bookingEnd) ||
//     (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
//     (currentTime <= bookingStart && slotEnd >= bookingEnd)
//   );
// });

export const addDurationToTime = (startTime: string, duration: number) => {
  // Split the startTime into hours and minutes
  const [hours, minutes] = startTime.split(":").map(Number);

  // Add the duration (in minutes) to the minutes
  let totalMinutes = minutes + duration;

  // Calculate the new hours and minutes
  let newHours = hours + Math.floor(totalMinutes / 60); // Add full hours
  let newMinutes = totalMinutes % 60; // Get remaining minutes

  // Ensure the hours are between 0 and 23 (24-hour format)
  newHours = newHours % 24;

  // Return the formatted time in HH:mm format
  return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(
    2,
    "0"
  )}`;
};

export const calculateEndTime = (
  selectedDate: Date,
  startTime: string,
  duration: number
): string => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const startDate = new Date(selectedDate);
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + duration);

  const endTimeFormatted = `${String(endDate.getHours()).padStart(
    2,
    "0"
  )}:${String(endDate.getMinutes()).padStart(2, "0")}`;

  return endTimeFormatted;
};

export const findExpectedRole = (currentRole: string) => {
  if (currentRole == "interviewer") {
    return "interviewee";
  } else if (currentRole == "interviewee") {
    return "interviewer";
  } else {
    return "";
  }
};
