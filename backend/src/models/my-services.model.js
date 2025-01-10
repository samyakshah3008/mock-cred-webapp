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
    required: true,
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
});

const myServicesListSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    requird: true,
    unique: true,
  },
  myServiceItems: [myServiceItemSchema],
});

export const MyServicesList = model("MyServicesList", myServicesListSchema);
