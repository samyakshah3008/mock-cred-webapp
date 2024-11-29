function prepareDay(day) {
  const formatTime = (time) => {
    if (!time) return undefined;

    // Check if time is already in "HH:MM" format
    if (/^\d{2}:\d{2}$/.test(time)) {
      return time;
    }

    // Otherwise, parse as an ISO string and convert to "HH:MM" format
    const date = new Date(time);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid time value");
    }
    return date.toISOString().slice(11, 16);
  };

  return {
    isAvailable: day.isAvailable,
    startTime: day.isAvailable ? formatTime(day.startTime) : undefined,
    endTime: day.isAvailable ? formatTime(day.endTime) : undefined,
  };
}

function transformDay(day) {
  return {
    isAvailable: day.isAvailable,
    startTime: day.startTime || "09:00",
    endTime: day.endTime || "17:00",
  };
}

export { prepareDay, transformDay };
