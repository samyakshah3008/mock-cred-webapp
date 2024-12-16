import { AIMockInterview } from "../models/ai-mock-interview.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getUserAIMockInterviewsDataService = async (userId) => {
  const userAIMockInterviewData = await AIMockInterview.findOne({
    userId: userId,
  });
  if (!userAIMockInterviewData) {
    return new ApiResponse(200, null, "No ai mock interviews given so far. ");
  }

  return new ApiResponse(
    200,
    userAIMockInterviewData,
    "User mock interview data successfully fetched!"
  );
};

const addNewAIMockInterviewService = async (
  userId,
  jobDescription,
  jobRole,
  yearsOfExperience,
  interviewDetails
) => {
  let userAIMockInterviewData = await AIMockInterview.findOne({ userId });

  let newEntry = {
    date: new Date(),
    jobDescription,
    jobRole,
    yearsOfExperience,
    interviewDetails,
  };

  if (!userAIMockInterviewData) {
    // create a new model and enter the first entry in list
    userAIMockInterviewData = new AIMockInterview({
      userId,
      aiMockInterviewList: [newEntry],
    });
  } else {
    // push new entry in the list
    userAIMockInterviewData.aiMockInterviewList.push(newEntry);
  }

  await userAIMockInterviewData.save();
};

const deleteAIMockInterviewService = async (userId, aiMockInterviewId) => {
  const userAIMockInterviewData = await AIMockInterview.findOne({
    userId: userId,
  });
  const particularAIMockInterviewEntryToDelete =
    userAIMockInterviewData.aiMockInterviewList.id(aiMockInterviewId);

  if (!particularAIMockInterviewEntryToDelete) {
    throw new ApiError(
      400,
      { errorData: "AI Mock interview entry not found." },
      "Failed to delete as no entry found"
    );
  }

  await particularAIMockInterviewEntryToDelete.deleteOne();
  await userAIMockInterviewData.save();

  return new ApiResponse(200, "Entry deleted successfully!");
};

export {
  addNewAIMockInterviewService,
  deleteAIMockInterviewService,
  getUserAIMockInterviewsDataService,
};
