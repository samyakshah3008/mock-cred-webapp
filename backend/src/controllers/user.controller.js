import fs from "fs";
import { User } from "../models/user.model.js";
import {
  checkIfOnboardingCompletedOrNotService,
  getUserDetailsService,
} from "../services/user.service.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getUserDetails = asyncHandler(async (req, res) => {
  const user = req?.user;
  try {
    const response = await getUserDetailsService(user?._id);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { errorData: error },
          error?.message || "something went wrong while getting user details"
        )
      );
  }
});

const checkIfOnboardingCompletedOrNot = asyncHandler(async (req, res) => {
  const { userId } = req?.query;
  try {
    const response = await checkIfOnboardingCompletedOrNotService(userId);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { errorData: error },
          error?.message || "something went wrong while checking onboarding"
        )
      );
  }
});

const saveOnboardingDetails = asyncHandler(async (req, res) => {
  const { stepCount, detailsObj } = req.body;
  const userId = req?.user?._id;
  if (!stepCount || !detailsObj || !Object.keys(detailsObj).length) {
    return res.status(400).json(new ApiError(400, {}, "Missing fields!"));
  }

  const findUser = await User.findById(userId);
  if (!findUser) {
    return res.status(400).json(new ApiError(400, {}, "User not found!"));
  }

  if (stepCount == 1) {
    const { socialAccountLink, username, howDoUserPlanToUseApp } = detailsObj;

    if (
      !socialAccountLink?.length ||
      !username?.length ||
      !howDoUserPlanToUseApp?.length
    ) {
      return res.status(400).json(new ApiError(400, {}, "Missing fields!"));
    }

    findUser.onboardingDetails.stepOne.socialAccountLink = socialAccountLink;
    findUser.onboardingDetails.stepOne.username = username;
    findUser.onboardingDetails.stepOne.howDoUserPlanToUseApp =
      howDoUserPlanToUseApp;

    await findUser.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Step 1 details saved successfully!"));
  } else if (stepCount == 3) {
    const { availability } = detailsObj;
    findUser.onboardingDetails.stepThree.availability = availability;

    findUser.isOnboardingComplete = true;

    await findUser.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Step 3 details saved successfully!"));
  }
});

const saveStepTwoOnboardingDetails = asyncHandler(async (req, res) => {
  const { aboutText } = req?.body;
  try {
    const file = req?.file;
    if (!file) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            { errorData: "No file uploaded" },
            "No file uploaded"
          )
        );
    }

    const localFilePath = file.path;
    const result = await uploadOnCloudinary(localFilePath);

    if (!result) {
      return res.status(500).json({ message: "Failed to upload image" });
    }

    fs.unlinkSync(localFilePath);

    const user = await User.findByIdAndUpdate(
      req?.user?._id,
      { "onboardingDetails.stepTwo.profilePicURL": result.secure_url },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.onboardingDetails.stepTwo.aboutText = aboutText;

    await user.save();

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicURL: user.onboardingDetails.stepTwo.profilePicURL,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

export {
  checkIfOnboardingCompletedOrNot,
  getUserDetails,
  saveOnboardingDetails,
  saveStepTwoOnboardingDetails,
};
