import {
  checkIfOnboardingCompletedOrNotService,
  getUserDetailsService,
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

export { checkIfOnboardingCompletedOrNot, getUserDetails };
