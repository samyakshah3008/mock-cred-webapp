import { model, Schema } from "mongoose";

const myServiceItemSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  isPrivate: {
    type: Boolean,
    default: true,
    required: true,
  },
  bookingCount: {
    type: Number,
    default: 0,
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
