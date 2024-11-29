import jwt from "jsonwebtoken";
import { generateOTP } from "../constants/node-mailer.js";
import { OTP } from "../models/otp.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      { errorData: error },
      error?.message ||
        "Something went wrong while generating access and refreshing tokens"
    );
  }
};

const signinUser = async (userDetails) => {
  const { email } = userDetails;
  if (!email) {
    throw new ApiError(
      400,
      { errorData: "Email is required" },
      "Email is required!"
    );
  }

  const findRegisteredUserWithEmail = await User.findOne({ email });

  if (!findRegisteredUserWithEmail) {
    return new ApiResponse(
      200,
      {
        redirect: true,
        flow: "signin",
        message: "Account doesn't exists",
      },
      "Redirect to signup"
    );
  }

  await OTP.find({ email }).deleteMany();

  const otp = generateOTP();
  const otpPayload = { email, otp };

  await OTP.create(otpPayload);

  return new ApiResponse(200, {}, "OTP sent successfully");
};

const verifyOtpAndSigninUser = async (userDetails, otp) => {
  const { email } = userDetails;

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

  const findRegisteredUserWithEmail = await User.findOne({ email });

  if (!findRegisteredUserWithEmail) {
    throw new ApiError(
      404,
      { errorData: "Registering user not found" },
      "Registering user not found"
    );
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    findRegisteredUserWithEmail._id
  );

  return { findRegisteredUserWithEmail, accessToken, refreshToken };
};

const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(
      401,
      { errorData: "Unauthorized" },
      "User is not authorized!"
    );
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken._id);
    if (!user) {
      throw new ApiError(
        400,
        { errorData: "Invalid refresh token" },
        "Invalid refresh token"
      );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );
    const response = new ApiResponse(
      200,
      { accessToken, refreshToken },
      "Access token refreshed"
    );

    return { response, accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      400,
      { errorData: "Invalid refresh token" },
      "Invalid refresh token"
    );
  }
};

const signupUser = async (userDetails) => {
  const { email, firstName } = userDetails;

  if (!email) {
    throw new ApiError(
      400,
      { errorData: "Email is required" },
      "Email is required"
    );
  }

  if (!firstName) {
    throw new ApiError(
      400,
      { errorData: "First name is required" },
      "First name is required"
    );
  }

  const findRegisteredUserWithEmail = await User.findOne({ email });

  if (findRegisteredUserWithEmail) {
    return new ApiResponse(200, {
      redirect: true,
      flow: "signup",
      message: "Account already exists",
    });
  }

  await OTP.find({ email }).deleteMany();

  const otp = generateOTP();
  const otpPayload = { email, otp };

  await OTP.create(otpPayload);

  return new ApiResponse(200, { otp }, "OTP sent successfully");
};

const verifyOTPAndRegisterUser = async (userDetails, otp) => {
  const { email, firstName, lastName = "" } = userDetails;

  if (!email) {
    throw new ApiError(
      400,
      { errorData: "Email is required" },
      "Email is required"
    );
  }

  if (!firstName) {
    throw new ApiError(
      400,
      { errorData: "First name is required" },
      "First name is required"
    );
  }

  if (!otp) {
    throw new ApiError(
      400,
      { errorData: "OTP is required" },
      "OTP is required"
    );
  }

  const findOTP = await OTP.findOne({ email });

  if (!findOTP || !findOTP._id) {
    throw new ApiError(
      401,
      { errorData: "OTP expired, please resend the OTP" },
      "OTP expired, please resend the OTP"
    );
  }

  if (findOTP.otp !== otp) {
    throw new ApiError(
      401,
      { errorData: "Incorrect OTP, please try again." },
      "Incorrect OTP, please try again."
    );
  }

  const user = await User.create({ email, firstName, lastName });

  const registeredUser = await User.findById(user._id).select("-refreshToken");

  if (!registeredUser) {
    throw new ApiError(
      500,
      {
        errorData: "Something went wrong while registering user.",
      },
      "Something went wrong while registering user."
    );
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  return {
    accessToken,
    refreshToken,
    registeredUser,
  };
};

const signoutUser = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  return new ApiResponse(200, {}, "User logged out successfully");
};

export {
  generateAccessAndRefreshTokens,
  refreshAccessToken,
  signinUser,
  signoutUser,
  signupUser,
  verifyOTPAndRegisterUser,
  verifyOtpAndSigninUser,
};
