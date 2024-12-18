import { model, Schema } from "mongoose";

const AIMockInterviewItemSchema = new Schema({
  date: {
    type: Date,
    default: new Date(),
  },
  jobDescription: {
    type: String,
    required: true,
  },
  jobRole: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  interviewDetails: {},
});

const AIMockInterviewSchema = new Schema({
  userId: {
    ref: "user",
    type: Schema.Types.ObjectId,
    required: true,
  },

  aiMockInterviewList: [AIMockInterviewItemSchema],
});

export const AIMockInterview = model("AIMockInterview", AIMockInterviewSchema);
