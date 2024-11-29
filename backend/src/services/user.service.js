import fs from "fs";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";

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
  const localFilePath = file.path;
  const result = await uploadOnCloudinary(localFilePath);

  if (!result) {
    throw new ApiError(500, {}, "Failed to upload image");
  }

  fs.unlinkSync(localFilePath);

  const user = await User.findByIdAndUpdate(
    userId,
    { "onboardingDetails.stepTwo.profilePicURL": result.secure_url },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, {}, "User not found!");
  }

  user.onboardingDetails.stepTwo.aboutText = aboutText;

  await user.save();

  res.status(200).json({
    message: "Profile picture uploaded successfully",
    profilePicURL: user.onboardingDetails.stepTwo.profilePicURL,
  });
};
export {
  checkIfOnboardingCompletedOrNotService,
  getUserDetailsService,
  saveOnboardingDetailsService,
  saveStepTwoOnboardingDetailsService,
};
