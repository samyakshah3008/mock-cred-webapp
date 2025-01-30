import { generateOTP } from "../constants/node-mailer.js";
import { isEmailExists, isUsernameExists } from "../helpers/user.js";
import { OTP } from "../models/otp.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import { v2 as cloudinary } from "cloudinary";

const sendOTPToNewEmailService = async (userId, email) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, { message: "User not found" });
  }

  if (isEmailExists(email, userId)) {
    throw new ApiError(400, { message: "Email already exists" });
  }

  await OTP.find({ email }).deleteMany();

  const otp = generateOTP();
  const otpPayload = { email, otp };

  await OTP.create(otpPayload);

  return new ApiResponse(200, {}, "OTP sent successfully");
};

const verifyOTPAndUpdateEmailService = async (userId, email, otp) => {
  if (!otp) {
    throw new ApiError(
      400,
      { errorData: "otp is required" },
      "OTP is required!"
    );
  }

  if (!email) {
    throw new ApiError(
      400,
      { errorData: "Email is required" },
      "Email address is required!"
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, { message: "User not found" });
  }

  const findOTP = await OTP.findOne({ email });

  if (!findOTP || !findOTP._id) {
    throw new ApiError(
      400,
      { errorData: "OTP expired, please resend the OTP" },
      "OTP expired, please resend the OTP"
    );
  }

  if (findOTP.otp !== otp) {
    throw new ApiError(
      400,
      { errorData: "Incorrect OTP, please try again." },
      "Incorrect OTP, please try again."
    );
  }

  user.email = email;
  await user.save();

  return new ApiResponse(200, {}, "Email updated successfully");
};

const changeProfilePictureURLService = async (userId, profilePicURL) => {
  const user = await User.findById(userId);

  if (!user) {
    return new ApiError(404, { message: "User not found" });
  }

  // Check if a previous profile picture exists
  if (user?.onboardingDetails?.stepTwo?.profilePicURL) {
    // Extract the public ID from the existing Cloudinary URL
    const publicId = user.onboardingDetails.stepTwo.profilePicURL
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

  user.onboardingDetails.stepTwo.profilePicURL = profilePicURL;
  await findUser.save();
};

const changeBasicDetailsService = async (
  userId,
  firstName,
  lastName,
  username,
  aboutText,
  role
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, { message: "User not found" });
  }

  if (firstName) {
    user.firstName = firstName;
  }

  if (lastName) {
    user.lastName = lastName;
  }

  if (username) {
    if (isUsernameExists(username, userId)) {
      throw new ApiError(400, { message: "Username already exists" });
    }
    user.onboardingDetails.stepOne.username = username;
  }

  if (aboutText) {
    user.onboardingDetails.stepTwo.aboutText = aboutText;
  }

  if (role) {
    if (
      role !== "interviewer" &&
      role !== "interviewee" &&
      role !== "allrounder"
    ) {
      throw new ApiError(400, {
        message: "Role must be interviewer/interviewee/allrounder",
      });
    }
    user.role = role;
  }

  await user.save();

  return new ApiResponse(200, {}, "User details updated successfully");
};

const changeSocialAccountLinkService = async (
  userId,
  socialAccountLinksObj
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, { message: "User not found" });
  }

  const { linkedIn, github, X, peerlist, instagram } = socialAccountLinksObj;

  if (linkedIn) {
    user.onboardingDetails.stepFour.socialLinks.linkedIn = linkedIn;
  }
  if (github) {
    user.onboardingDetails.stepFour.socialLinks.github = github;
  }
  if (peerlist) {
    user.onboardingDetails.stepFour.socialLinks.peerlist = peerlist;
  }
  if (X) {
    user.onboardingDetails.stepFour.socialLinks.X = X;
  }
  if (instagram) {
    user.onboardingDetails.stepFour.socialLinks.instagram = instagram;
  }

  await user.save();

  return new ApiResponse(200, {}, "Social account links updated successfully");
};

const changeTechnicalDetailsService = async (userId, technicalDetails) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, { message: "User not found" });
  }

  const { position, company, preferredTechStack, yearsOfExperience } =
    technicalDetails;

  if (position) {
    user.onboardingDetails.stepFive.position = position;
  }

  if (company) {
    user.onboardingDetails.stepFive.company = company;
  }

  if (preferredTechStack) {
    user.onboardingDetails.stepFive.preferredTechStack = preferredTechStack;
  }

  if (yearsOfExperience) {
    user.onboardingDetails.stepFive.yearsOfExperience = yearsOfExperience;
  }

  await user.save();

  return new ApiResponse(200, {}, "Technical details updated successfully");
};

export {
  changeBasicDetailsService,
  changeProfilePictureURLService,
  changeSocialAccountLinkService,
  changeTechnicalDetailsService,
  sendOTPToNewEmailService,
  verifyOTPAndUpdateEmailService,
};
