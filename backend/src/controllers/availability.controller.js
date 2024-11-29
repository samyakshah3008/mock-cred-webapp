import {
  getUserAvailabilityService,
  updateUserAvaibilityService,
} from "../services/availability.service.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const getUserAvailability = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  try {
    const response = await getUserAvailabilityService(userId);
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
            "something went wrong fetching get my services list items of user"
        )
      );
  }
});

const updateUserAvaibility = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { data } = req.body;

  try {
    const response = await updateUserAvaibilityService(userId, data);
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
            "something went wrong while updating avaibility of user"
        )
      );
  }
});

export { getUserAvailability, updateUserAvaibility };
