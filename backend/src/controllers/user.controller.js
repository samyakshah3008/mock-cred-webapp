import {
  checkIfOnboardingCompletedOrNotService,
  fetchUsersAccordingToRoleService,
  getAggregateStatisticsService,
  getCustomUserPageInformationService,
  getServiceByUsernameAndIdService,
  getUserDetailsService,
  getUsersForMockInterviewsService,
  saveOnboardingDetailsService,
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
    console.log(error, "error");
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
  const { aboutText } = req.body;
  const file = req?.files?.profilePic;

  try {
    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
        errorData: { error: "File is required" },
      });
    }

    const cloudinaryResponse = await uploadOnCloudinary(file.data);

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
  } catch (error) {
    console.error(error, "error");
    return res.status(500).json({
      message: "Something went wrong while saving onboarding details",
      errorData: { error: error.message },
    });
  }
});

const fetchUsersAccordingToRole = asyncHandler(async (req, res) => {
  const { role } = req?.query;
  try {
    const response = await fetchUsersAccordingToRoleService(
      role,
      req?.user?._id?.toString()
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
          "something went wrong while fetching users"
        )
      );
  }
});

const getAggregateStatistics = asyncHandler(async (req, res) => {
  const { username } = req?.query;
  try {
    const response = await getAggregateStatisticsService(username);
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
          "something went wrong while fetching aggregate statistics"
        )
      );
  }
});

const getUsersForMockInterviews = asyncHandler(async (req, res) => {
  const { requiredRole } = req?.query;
  const userId = req?.user?._id;
  try {
    const response = await getUsersForMockInterviewsService(
      requiredRole,
      userId
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
          "something went wrong while fetching users"
        )
      );
  }
});

const reportBugController = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body: description,
        }),
      }
    );
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to create issue on GitHub" });
    }

    const issue = await response.json();
    res.status(200).json({
      message: "Bug reported successfully",
      issueURL: issue.html_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export {
  checkIfOnboardingCompletedOrNot,
  fetchUsersAccordingToRole,
  getAggregateStatistics,
  getCustomUserPageInformation,
  getServiceByUsernameAndId,
  getUserDetails,
  getUsersForMockInterviews,
  reportBugController,
  saveOnboardingDetails,
  saveStepTwoOnboardingDetails,
};
