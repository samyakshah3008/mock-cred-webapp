import { defaultAvailability } from "../constants/availability.js";
import { prepareDay, transformDay } from "../helpers/availability.js";
import Availability from "../models/availability.model.js";
import { ApiResponse } from "../utils/api-response.js";

const getUserAvailabilityService = async (userId) => {
  let userAvailability = await Availability.findOne({ userId }).exec();

  if (!userAvailability) {
    userAvailability = await Availability.create({
      userId,
      ...defaultAvailability,
    });
  }

  // Prepare availability data for response
  const availabilityData = {
    timeGap: userAvailability.timeGap,
    monday: transformDay(userAvailability.monday),
    tuesday: transformDay(userAvailability.tuesday),
    wednesday: transformDay(userAvailability.wednesday),
    thursday: transformDay(userAvailability.thursday),
    friday: transformDay(userAvailability.friday),
    saturday: transformDay(userAvailability.saturday),
    sunday: transformDay(userAvailability.sunday),
  };

  return new ApiResponse(
    200,
    availabilityData,
    "Successfully fetched availability data"
  );
};

const updateUserAvaibilityService = async (userId, data) => {
  const availabilityData = {
    timeGap: data.timeGap,
    monday: prepareDay(data.monday),
    tuesday: prepareDay(data.tuesday),
    wednesday: prepareDay(data.wednesday),
    thursday: prepareDay(data.thursday),
    friday: prepareDay(data.friday),
    saturday: prepareDay(data.saturday),
    sunday: prepareDay(data.sunday),
  };

  await Availability.findOneAndUpdate({ userId }, availabilityData, {
    new: true,
    upsert: true,
  }).exec();

  return new ApiResponse(200, {}, "Successfully updated availability data");
};

export { getUserAvailabilityService, updateUserAvaibilityService };
