import { model, Schema } from "mongoose";

const myServiceItemSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  meetingNotes: {
    type: String,
    trim: true,
    required: false,
  },
  duration: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  isPrivate: {
    type: Boolean,
    default: false,
    required: true,
  },
  bookingCount: {
    type: Number,
    default: 0,
  },
  locationURL: {
    type: String,
    trim: true,
    default: null,
    required: true,
  },
  yoe: {
    type: Number,
    required: true,
  },
  technologies: [
    {
      type: String,
      required: true,
    },
  ],
});

const myServicesListSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    requird: true,
    unique: true,
  },
  interviewerServiceItems: {
    type: [myServiceItemSchema],
    default: [],
  },
  intervieweeServiceItems: {
    type: [myServiceItemSchema],
    default: [],
  },
});

export const MyServicesList = model("MyServicesList", myServicesListSchema);
