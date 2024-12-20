import mongoose from "mongoose";
import { MyServicesList } from "../models/my-services.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getServicesOfUserService = async (user) => {
  const userId = new mongoose.Types.ObjectId(user?._id);

  const myServicesList = await MyServicesList.findOne({ userId });

  return new ApiResponse(
    200,
    { myServiceItems: myServicesList?.myServiceItems || [] },
    "Successfully fetched my services items"
  );
};

const addNewServiceToServicesListOfUserService = async (
  user,
  myServiceItem
) => {
  const { title, meetingNotes, duration, isPrivate, url } = myServiceItem;

  const newMyServiceItem = {
    title,
    meetingNotes,
    duration,
    isPrivate,
    url,
  };

  let myServiceItemsList = await MyServicesList.findOne({ userId: user?._id });

  if (!myServiceItemsList) {
    myServiceItemsList = new MyServicesList({
      userId: user?._id,
      myServiceItems: [newMyServiceItem],
    });
  } else {
    // first confirm if url doesnt exist
    const findURL = myServiceItemsList.myServiceItems.filter(
      (item) => item.url === url
    );
    if (findURL?.length) {
      throw new ApiError(
        400,
        {
          errorData:
            "URL already exists in other event. Please use a different url.",
        },
        ""
      );
    } else {
      myServiceItemsList.myServiceItems.push(newMyServiceItem);
    }
  }

  await myServiceItemsList.save();

  return new ApiResponse(
    201,
    { message: "Successfully added item to my services list" },
    "Successfully added item to my services list"
  );
};

const updateParticularServiceItemFromServicesListOfUserService = async (
  user,
  myServiceItemObj
) => {
  const { title, meetingNotes, duration, isPrivate, url } = myServiceItemObj;

  const myServiceItem = await MyServicesList.findOne({ userId: user?._id });

  if (!myServiceItem) {
    throw new ApiError(404, { message: "My services is empty for this user." });
  }

  const particularServiceItem = myServiceItem.myServiceItems.id(
    myServiceItemObj?._id
  );

  if (!particularServiceItem) {
    throw new ApiError(404, { message: "Service item not found!" });
  }

  if (title !== undefined) particularServiceItem.title = title;
  if (meetingNotes !== undefined)
    particularServiceItem.meetingNotes = meetingNotes;
  if (duration !== undefined) particularServiceItem.duration = duration;
  particularServiceItem.isPrivate = isPrivate;

  const findURL = myServiceItem.myServiceItems.filter(
    (item) => item.url === url && item.id !== myServiceItemObj?._id
  );

  if (findURL?.length) {
    throw new ApiError(
      400,
      {
        errorData:
          "URL already exists in other event. Please use a different url.",
      },
      ""
    );
  } else {
    particularServiceItem.url = url;
  }

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
  const myServiceList = await MyServicesList.findOne({ userId: user?._id });

  if (!myServiceList) {
    throw new ApiError(404, {
      message: "My services list is empty for this user.",
    });
  }

  const particularServiceItem =
    myServiceList.myServiceItems.id(myServiceItemId);

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
