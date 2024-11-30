import { v2 as cloudinary } from "cloudinary";
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
    const { availability } = detailsObj;
    findUser.onboardingDetails.stepThree.availability = availability;

    findUser.isOnboardingComplete = true;

    await findUser.save();

    return new ApiResponse(200, {}, "Step 3 details saved successfully!");
  }
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
  getUserDetailsService,
  saveOnboardingDetailsService,
  saveStepTwoOnboardingAboutTextDetailsService,
  saveStepTwoOnboardingDetailsService,
};
