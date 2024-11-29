import { model, Schema } from "mongoose";

const noteSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  interviewDetails: {
    date: Date,
    position: String,
    interviewer: String,
  },
  questionsAsked: {
    type: String,
    trim: true,
    required: true,
  },
  thingsToImprove: {
    type: String,
    trim: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

const notesListSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  notes: [noteSchema],
});

export const MyNotesList = model("MyNotesList", notesListSchema);
