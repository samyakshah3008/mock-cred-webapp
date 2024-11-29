import { cookieOptions } from "../constants/node-mailer.js";
import {
  refreshAccessToken,
  signinUser,
  signoutUser,
  signupUser,
  verifyOTPAndRegisterUser,
  verifyOtpAndSigninUser,
} from "../services/auth.service.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const signupUserController = asyncHandler(async (req, res, next) => {
  const { userDetails } = req.body;

  try {
    const response = await signupUser(userDetails);
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
          error?.message ||
            "Something went wrong with servers while sending OTP, please try again later."
        )
      );
  }
});

const verifyOTPAndRegisterUserController = asyncHandler(
  async (req, res, next) => {
    const { userDetails, otp } = req.body;

    try {
      const { accessToken, refreshToken, registeredUser } =
        await verifyOTPAndRegisterUser(userDetails, otp);
      const user = registeredUser;

      return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken, user },

            "User registered successfully"
          )
        );
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
            error?.message ||
              "Something went wrong with servers while verifying OTP, please try again later."
          )
        );
    }
  }
);

const signinUserController = asyncHandler(async (req, res, next) => {
  const { userDetails } = req.body;

  try {
    const response = await signinUser(userDetails);
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
          error,
          "Something went wrong with servers while sending OTP, please try again later."
        )
      );
  }
});

const verifyOTPAndSigninUserController = asyncHandler(
  async (req, res, next) => {
    const { userDetails, otp } = req.body;

    try {
      const { accessToken, refreshToken, findRegisteredUserWithEmail } =
        await verifyOtpAndSigninUser(userDetails, otp);
      const user = findRegisteredUserWithEmail;
      return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken, user },
            "User Signed in successfully"
          )
        );
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
            error?.message ||
              "Something went wrong with servers while verifying OTP, please try again later."
          )
        );
    }
  }
);

const refreshAccessTokenController = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  try {
    const { response, accessToken, refreshToken } = await refreshAccessToken(
      incomingRefreshToken
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(response);
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
          error?.message ||
            "Something went wrong with servers while refreshing Token, please try again later."
        )
      );
  }
});

const logoutUserController = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  try {
    const response = await signoutUser(userId);
    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(response);
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
          error?.message ||
            "Something went wrong with servers while logging user out, please try again later."
        )
      );
  }
});

export {
  logoutUserController,
  refreshAccessTokenController,
  signinUserController,
  signupUserController,
  verifyOTPAndRegisterUserController,
  verifyOTPAndSigninUserController,
};
