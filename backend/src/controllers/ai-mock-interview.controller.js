import {
  addNewAIMockInterviewService,
  deleteAIMockInterviewService,
  getParticularAIMockInterviewDataService,
  getUserAIMockInterviewsDataService,
} from "../services/ai-mock-interview.service.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const getUserAIMockInterviewsData = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  try {
    const response = await getUserAIMockInterviewsDataService(userId);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(500).json({
      errorData:
        "Something went wrong while fetching user ai mock interviews data",
    });
  }
});

const getParticularAIMockInterviewData = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { id } = req?.params;

  if (!id) {
    return res
      .status(400)
      .json({ errorData: "Mock interview id is mandatory." });
  }
  try {
    const response = await getParticularAIMockInterviewDataService(userId, id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error, "error");
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(500).json({
      errorData:
        "Something went wrong while fetching particular user ai mock interviews data",
    });
  }
});

const addNewAIMockInterview = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { jobDescription, jobRole, yearsOfExperience, interviewDetails } =
    req?.body;

  if (!jobDescription?.length) {
    return res.status(400).json({ errorData: "Job description is required. " });
  }
  if (!jobRole?.length) {
    return res.status(400).json({ errorData: "Job role is required. " });
  }

  try {
    const response = await addNewAIMockInterviewService(
      userId,
      jobDescription,
      jobRole,
      yearsOfExperience,
      interviewDetails
    );
    return res.status(201).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(500).json({
      errorData:
        "Something went wrong while adding a new ai mock interview entry.",
    });
  }
});

const deleteAIMockInterview = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const { aiMockInterviewId } = req?.query;

  if (!aiMockInterviewId) {
    return res
      .status(400)
      .json({ errorData: "AI Mock interview id is required." });
  }

  try {
    const response = await deleteAIMockInterviewService(
      userId,
      aiMockInterviewId
    );
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(500).json({
      errorData: "Something went wrong while deleting ai mock interview entry.",
    });
  }
});

export {
  addNewAIMockInterview,
  deleteAIMockInterview,
  getParticularAIMockInterviewData,
  getUserAIMockInterviewsData,
};
