import fs from "fs";
import {
  checkIfOnboardingCompletedOrNotService,
  getCustomUserPageInformationService,
  getServiceByUsernameAndIdService,
  getUserDetailsService,
  saveOnboardingDetailsService,
  saveStepTwoOnboardingAboutTextDetailsService,
  saveStepTwoOnboardingDetailsService,
} from "../services/user.service.js";
import { ApiError } from "../utils/api-error.js";
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

const getCustomUserPageInformation = asyncHandler(async (req, res) => {
  const { username } = req?.query;

  try {
    const response = await getCustomUserPageInformationService(username);
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
          { message: error?.message },
          "something went wrong while fetching user. "
        )
      );
  }
});

const getServiceByUsernameAndId = asyncHandler(async (req, res) => {
  const { username, eventURL, role } = req?.query;
  try {
    const response = await getServiceByUsernameAndIdService(
      username,
      eventURL,
      role
    );
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
          { message: error?.message },
          "something went wrong while fetching service details. "
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

  try {
    const response = await saveOnboardingDetailsService(
      userId,
      detailsObj,
      stepCount
    );
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

const saveStepTwoOnboardingDetails = asyncHandler(async (req, res) => {
  const { aboutText, profilePic } = req.body;

  try {
    if (profilePic?.includes("cloudinary")) {
      const response = await saveStepTwoOnboardingAboutTextDetailsService(
        aboutText,
        req?.user?._id
      );
      return res.status(200).json(response);
    } else {
      const file = req.file;
      if (!file) {
        return res.status(400).json({
          message: "No file uploaded",
          errorData: { error: "File is required" },
        });
      }
      const localFilePath = file.path;

      const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }

      if (!cloudinaryResponse) {
        return res.status(500).json({
          message: "Failed to upload image to Cloudinary",
          errorData: { error: "Upload failed" },
        });
      }

      const response = await saveStepTwoOnboardingDetailsService(
        aboutText,
        cloudinaryResponse.secure_url,
        req.user._id
      );

      return res.status(200).json(response);
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while saving onboarding details",
      errorData: { error: error.message },
    });
  }
});

export {
  checkIfOnboardingCompletedOrNot,
  getCustomUserPageInformation,
  getServiceByUsernameAndId,
  getUserDetails,
  saveOnboardingDetails,
  saveStepTwoOnboardingDetails,
};
