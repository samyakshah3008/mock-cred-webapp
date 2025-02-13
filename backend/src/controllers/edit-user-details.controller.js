import fs from "fs";
import {
  changeBasicDetailsService,
  changeProfilePictureURLService,
  changeSocialAccountLinkService,
  changeTechnicalDetailsService,
  sendOTPToNewEmailService,
  verifyOTPAndUpdateEmailService,
} from "../services/edit-user-details.service.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const sendOTPToNewEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userId = req?.user?._id;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  try {
    const response = await sendOTPToNewEmailService(userId, email);
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
          "something went wrong while sending OTP to new email"
        )
      );
  }
});

const verifyOTPForNewEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const userId = req?.user?._id;

  try {
    const response = await verifyOTPAndUpdateEmailService(userId, email, otp);
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
          "something went wrong while verifying OTP to new email"
        )
      );
  }
});

const changeProfilePictureURL = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  try {
    const file = req.file;
    console.log(file, "file");
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

    const response = await changeProfilePictureURLService(
      userId,
      cloudinaryResponse.secure_url
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
          "something went wrong while changing profile picture URL"
        )
      );
  }
});

const changeBasicDetails = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { firstName, lastName, username, role, aboutText } = req.body;

  try {
    const response = await changeBasicDetailsService(
      userId,
      firstName,
      lastName,
      username,
      aboutText,
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
          "something went wrong while editing basic details"
        )
      );
  }
});

const changeSocialAccountLinks = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { socialLinks } = req.body;

  try {
    const response = await changeSocialAccountLinkService(userId, socialLinks);
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
          "something went wrong while changing social account links"
        )
      );
  }
});

const changeTechnicalDetails = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { technicalDetails } = req.body;

  try {
    const response = changeTechnicalDetailsService(userId, technicalDetails);
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
          "something went wrong while changing technical details"
        )
      );
  }
});

export {
  changeBasicDetails,
  changeProfilePictureURL,
  changeSocialAccountLinks,
  changeTechnicalDetails,
  sendOTPToNewEmail,
  verifyOTPForNewEmail,
};
