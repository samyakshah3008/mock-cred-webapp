import mongoose from "mongoose";
import { MyServicesList } from "../models/my-services.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getServicesOfUserService = async (user) => {
  const userId = new mongoose.Types.ObjectId(user?._id);

  const myServicesList = await MyServicesList.findOne({ userId });

  return new ApiResponse(
    200,
    {
      myServiceItems:
        user?.role == "interviewer"
          ? myServicesList?.interviewerServiceItems || []
          : user?.role == "interviewee"
          ? myServicesList?.intervieweeServiceItems || []
          : {
              interviewer: myServicesList?.interviewerServiceItems || [],
              interviewee: myServicesList?.intervieweeServiceItems || [],
            },
    },
    "Successfully fetched my services items"
  );
};

const addNewServiceToServicesListOfUserService = async (
  user,
  myServiceItem
) => {
  const {
    title,
    meetingNotes,
    duration,
    isPrivate,
    url,
    yoe,
    technologies,
    role,
    locationURL,
  } = myServiceItem;

  const newMyServiceItem = {
    title,
    meetingNotes,
    duration: Number(duration),
    isPrivate,
    url,
    yoe: Number(yoe),
    technologies,
    locationURL,
  };

  let myServiceItemsList = await MyServicesList.findOne({ userId: user?._id });

  if (!myServiceItemsList) {
    if (role == "interviewer") {
      myServiceItemsList = new MyServicesList({
        userId: user?._id,
        interviewerServiceItems: [newMyServiceItem],
      });
    } else if (role == "interviewee") {
      myServiceItemsList = new MyServicesList({
        userId: user?._id,
        intervieweeServiceItems: [newMyServiceItem],
      });
    } else {
      throw new ApiError(400, { errorData: "Invalid role" }, "Invalid role");
    }
  } else {
    if (role == "interviewer") {
      const findURLInterviewer =
        myServiceItemsList.interviewerServiceItems.filter(
          (item) => item.url === url
        );
      const findURLInterviewee =
        myServiceItemsList.intervieweeServiceItems.filter(
          (item) => item.url === url
        );
      if (findURLInterviewer?.length || findURLInterviewee?.length) {
        throw new ApiError(
          400,
          {
            errorData:
              "URL already exists in other event. Please use a different url.",
          },
          ""
        );
      } else {
        myServiceItemsList.interviewerServiceItems.push(newMyServiceItem);
      }
    } else if (role == "interviewee") {
      const findURLInterviewer =
        myServiceItemsList.interviewerServiceItems.filter(
          (item) => item.url === url
        );
      const findURLInterviewee =
        myServiceItemsList.intervieweeServiceItems.filter(
          (item) => item.url === url
        );
      if (findURLInterviewer?.length || findURLInterviewee?.length) {
        throw new ApiError(
          400,
          {
            errorData:
              "URL already exists in other event. Please use a different url.",
          },
          ""
        );
      } else {
        myServiceItemsList.intervieweeServiceItems.push(newMyServiceItem);
      }
    } else {
      throw new ApiError(400, { errorData: "Invalid role" }, "Invalid role");
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
  const {
    title,
    meetingNotes,
    duration,
    isPrivate,
    locationURL,
    url,
    yoe,
    technologies,
    role,
  } = myServiceItemObj;

  const myServiceItem = await MyServicesList.findOne({ userId: user?._id });

  if (!myServiceItem) {
    throw new ApiError(404, { message: "My services is empty for this user." });
  }

  let particularServiceItem;

  if (role == "interviewer") {
    particularServiceItem = myServiceItem.interviewerServiceItems.id(
      myServiceItemObj?._id
    );
  } else if (role == "interviewee") {
    particularServiceItem = myServiceItem.intervieweeServiceItems.id(
      myServiceItemObj?._id
    );
  } else {
    throw new ApiError(400, { errorData: "Invalid role" }, "Invalid role");
  }

  if (!particularServiceItem) {
    throw new ApiError(404, { message: "Service item not found!" });
  }

  if (title !== undefined) particularServiceItem.title = title;
  if (meetingNotes !== undefined)
    particularServiceItem.meetingNotes = meetingNotes;
  if (duration !== undefined) particularServiceItem.duration = Number(duration);
  particularServiceItem.isPrivate = isPrivate;
  if (isPrivate !== undefined) particularServiceItem.isPrivate = isPrivate;
  if (locationURL !== undefined)
    particularServiceItem.locationURL = locationURL;
  if (yoe !== undefined) particularServiceItem.yoe = Number(yoe);
  if (technologies !== undefined)
    particularServiceItem.technologies = technologies;

  const findURL = myServiceItem.intervieweeServiceItems.filter(
    (item) => item.url === url && item.id !== myServiceItemObj?._id
  );
  const findURLInterviewer = myServiceItem.interviewerServiceItems.filter(
    (item) => item.url === url && item.id !== myServiceItemObj?._id
  );

  if (findURL?.length || findURLInterviewer?.length) {
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
  myServiceItemId,
  role
) => {
  const myServiceList = await MyServicesList.findOne({ userId: user?._id });

  if (!myServiceList) {
    throw new ApiError(404, {
      message: "My services list is empty for this user.",
    });
  }

  let particularServiceItem;

  if (role == "interviewer") {
    particularServiceItem =
      myServiceList.interviewerServiceItems.id(myServiceItemId);
  } else if (role == "interviewee") {
    particularServiceItem =
      myServiceList.intervieweeServiceItems.id(myServiceItemId);
  } else {
    particularServiceItem =
      myServiceList.interviewerServiceItems.id(myServiceItemId) ||
      myServiceList.intervieweeServiceItems.id(myServiceItemId);
  }

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
