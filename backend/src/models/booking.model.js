import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
  {
    additionalInfo: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: "Please enter a valid email",
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: String,
      required: true,
      validate: {
        validator: (time) => /^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time),
        message: "Time must be in HH:MM format",
      },
    },
    endTime: {
      type: String,
      required: true,
      validate: {
        validator: (time) => /^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time),
        message: "Time must be in HH:MM format",
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["upcoming", "unconfirmed", "past", "canceled", "approved"],
      default: "unconfirmed",
    },
    testimonialReceived: {
      type: String,
      trim: true,
      default: null,
    },
    ratingReceived: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
    feedbackReceived: {
      type: String,
      trim: true,
      default: null,
    },
    locationURL: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const bookingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  interviewerBookings: {
    type: [meetingSchema],
    default: [],
  },
  intervieweeBookings: {
    type: [meetingSchema],
    default: [],
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);
