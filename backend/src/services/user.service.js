import { v2 as cloudinary } from "cloudinary";
import Availability from "../models/availability.model.js";
import { MyServicesList } from "../models/my-services.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getUserDetailsService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, { message: "User not found" }, "User not found");
  }

  return user;
};

const checkIfOnboardingCompletedOrNotService = async (userId) => {
  const user = await User.findById(userId);

  if (user?.isOnboardingComplete) {
    return { isOnboardingComplete: true };
  } else {
    return { isOnboardingComplete: false };
  }
};

const saveOnboardingDetailsService = async (userId, detailsObj, stepCount) => {
  const findUser = await User.findById(userId);
  if (!findUser) {
    throw new ApiError(400, {}, "User not found!");
  }

  if (stepCount == 1) {
    const { socialAccountLink, username, howDoUserPlanToUseApp } = detailsObj;

    if (
      !socialAccountLink?.length ||
      !username?.length ||
      !howDoUserPlanToUseApp?.length
    ) {
      throw new ApiError(400, {}, "Missing fields!");
    }

    const isUsernameExists = await User.findOne({
      "onboardingDetails.stepOne.username": username,
      _id: { $ne: userId },
    });

    if (isUsernameExists) {
      throw new ApiError(
        400,
        { errorData: "Username already exists" },
        "Username already exists! Please try a different username. "
      );
    }

    findUser.onboardingDetails.stepOne.socialAccountLink = socialAccountLink;
    findUser.onboardingDetails.stepOne.username = username;
    findUser.onboardingDetails.stepOne.howDoUserPlanToUseApp =
      howDoUserPlanToUseApp;

    await findUser.save();

    return new ApiResponse(200, {}, "Step 1 details saved successfully!");
  } else if (stepCount == 3) {
    findUser.onboardingDetails.stepThree.availability = detailsObj;

    findUser.isOnboardingComplete = true;

    await findUser.save();

    let newAvaibility = {
      userId,
      ...detailsObj,
    };

    await Availability.create(newAvaibility);

    return new ApiResponse(200, {}, "Step 3 details saved successfully!");
  }
};

const getCustomUserPageInformationService = async (username) => {
  const user = await User.findOne({
    "onboardingDetails.stepOne.username": username,
  }).exec();

  if (!user) {
    throw new ApiError(404, { message: "User not found" }, "User not found");
  }

  const myServicesList = await MyServicesList.findOne({
    userId: user._id,
  }).exec();

  const result = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    onboardingDetails: user.onboardingDetails,
    services: {
      myServiceItems: myServicesList ? myServicesList.myServiceItems : [],
    },
  };

  return result;
};

const getServiceByUsernameAndIdService = async () => {
  const user = await User.findOne({
    "onboardingDetails.stepOne.username": username,
  }).exec();

  if (!user) {
    throw new ApiError(404, { message: "User not found" }, "User not found");
  }

  const myServicesList = await MyServicesList.findOne({
    userId: user._id,
  }).exec();
  if (!myServicesList) {
    throw new ApiError(
      404,
      { message: "Service list not found" },
      "Service list not found"
    );
  }

  const serviceItem = myServicesList.myServiceItems.find(
    (item) => item._id.toString() === serviceId
  );

  if (!serviceItem) {
    throw new ApiError(
      404,
      { message: "Service not found" },
      "Service not found"
    );
  }

  const userAvaibility = await Availability.findOne({
    userId: user._id,
  }).exec();

  if (!userAvaibility) {
    throw new ApiError(
      404,
      { message: "User avaibility not found" },
      "User avaibility not found"
    );
  }

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    service: serviceItem,
    userAvaibility: userAvaibility || [],
  };
};

const saveStepTwoOnboardingDetailsService = async (aboutText, file, userId) => {
  const findUser = await User.findById(userId);

  // Check if a previous profile picture exists
  if (findUser?.onboardingDetails?.stepTwo?.profilePicURL) {
    // Extract the public ID from the existing Cloudinary URL
    const publicId = findUser.onboardingDetails.stepTwo.profilePicURL
      .split("/")
      .pop()
      .split(".")[0];

    // Delete the old image from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new ApiError(
        400,
        { errorData: error },
        "Error while deleting previous cloudinary"
      );
    }
  }

  findUser.onboardingDetails.stepTwo.profilePicURL = file;
  findUser.onboardingDetails.stepTwo.aboutText = aboutText;
  await findUser.save();

  return new ApiResponse(
    200,
    {
      profilePicUrl: findUser.onboardingDetails.stepTwo.profilePicURL,
      aboutText: findUser.onboardingDetails.stepTwo.aboutText,
    },
    "Success"
  );
};

const saveStepTwoOnboardingAboutTextDetailsService = async (
  aboutText,
  userId
) => {
  const findUser = await User.findById(userId);
  findUser.onboardingDetails.stepTwo.aboutText = aboutText;
  await findUser.save();
  return new ApiResponse(
    200,
    {
      profilePicUrl: findUser.onboardingDetails.stepTwo.profilePicURL,
      aboutText: findUser.onboardingDetails.stepTwo.aboutText,
    },
    "Success"
  );
};

export {
  checkIfOnboardingCompletedOrNotService,
  getCustomUserPageInformationService,
  getServiceByUsernameAndIdService,
  getUserDetailsService,
  saveOnboardingDetailsService,
  saveStepTwoOnboardingAboutTextDetailsService,
  saveStepTwoOnboardingDetailsService,
};
