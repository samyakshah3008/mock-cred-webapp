import mongoose from "mongoose";
import { myEventsList } from "../models/event.mode.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getServicesOfUserService = async (user) => {
  const userId = new mongoose.Types.ObjectId(user?._id);

  const myEventList = await myEventsList.findOne({ userId });

  return new ApiResponse(
    200,
    { myEventItems: myEventList?.myEventItems || [] },
    "Successfully fetched my services items"
  );
};

const addNewServiceToServicesListOfUserService = async (
  user,
  myServiceItem
) => {
  const { title, description, duration, isPrivate } = myServiceItem;

  const newMyEventItem = {
    title,
    description,
    duration,
    isPrivate,
  };

  let myEventItemsList = await myEventsList.findOne({ userId: user?._id });

  if (!myEventItemsList) {
    myEventItemsList = new myEventsList({
      userId: user?._id,
      myEventItems: [newMyEventItem],
    });
  } else {
    myEventItemsList.myEventItems.push(newMyEventItem);
  }

  await myEventItemsList.save();

  return new ApiResponse(
    201,
    { message: "Successfully added item to my services list" },
    "Successfully added item to my services list"
  );
};

const updateParticularServiceItemFromServicesListOfUserService = async (
  user,
  myServiceItemObj,
  myServiceItemId
) => {
  const { title, description, duration, isPrivate } = myServiceItemObj;

  const myServiceItem = await myEventsList.findOne({ userId: user?._id });

  if (!myServiceItem) {
    throw new ApiError(404, { message: "My services is empty for this user." });
  }

  const particularServiceItem = myServiceItem.myEventItems.id(myServiceItemId);

  if (!particularServiceItem) {
    throw new ApiError(404, { message: "Service item not found!" });
  }

  if (title !== undefined) particularServiceItem.title = title;
  if (description !== undefined)
    particularServiceItem.description = description;
  if (duration !== undefined) particularServiceItem.duration = duration;
  particularServiceItem.isPrivate = isPrivate;

  await myServiceItem.save();

  return new ApiResponse(
    200,
    { message: "Successfully updated item in my services list" },
    "Successfully updated item in my services list"
  );
};

const deleteParticularItemFromServicesListOfUserService = async (
  user,
  myServiceItemId
) => {
  const myServiceList = await myEventsList.findOne({ userId: user?._id });

  if (!myServiceList) {
    throw new ApiError(404, {
      message: "My services list is empty for this user.",
    });
  }

  const particularServiceItem = myServiceList.myEventItems.id(myServiceItemId);

  if (!particularServiceItem) {
    throw new ApiError(404, { message: "Service item not found!" });
  }

  await particularServiceItem.deleteOne();
  await myServiceList.save();

  return new ApiResponse(
    200,
    { message: "Successfully deleted item in my services list" },
    "Successfully deleted item in my services list"
  );
};

export {
  addNewServiceToServicesListOfUserService,
  deleteParticularItemFromServicesListOfUserService,
  getServicesOfUserService,
  updateParticularServiceItemFromServicesListOfUserService,
};
