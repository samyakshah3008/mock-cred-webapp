import {
  checkIfOnboardingCompletedOrNotService,
  getUserDetailsService,
  saveOnboardingDetailsService,
  saveStepTwoOnboardingDetailsService,
} from "../services/user.service.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

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

    const response = saveStepTwoOnboardingDetailsService(
      aboutText,
      file,
      req?.user?._id
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
          error?.message || "something went wrong while saving onboarding step2"
        )
      );
  }
});

export {
  checkIfOnboardingCompletedOrNot,
  getUserDetails,
  saveOnboardingDetails,
  saveStepTwoOnboardingDetails,
};
