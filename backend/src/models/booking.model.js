import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
  participantInformation: {
    interviewer: {
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
    },
    interviewee: {
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
    },
  },

  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
    // validate: {
    //   validator: (time) => /^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time),
    //   message: "Time must be in HH:MM format",
    // },
  },
  status: {
    type: String,
    required: true,
    enum: ["upcoming", "unconfirmed", "past", "canceled", "approved"],
    default: "upcoming",
  },
  locationURL: {
    type: String,
    trim: true,
    default: null,
  },
  additionalInfo: {
    type: String,
    trim: true,
  },
  testimonialReceived: {
    type: String,
    trim: true,
    default: null,
  },
  ratingReceived: {
    type: Number,
    min: 0,
    max: 5,
    default: null,
  },
  feedbackReceived: {
    type: String,
    trim: true,
    default: null,
  },
  meetingId: {
    type: String,
    required: true,
  },
  bookingLink: {
    type: String,
    required: true,
  },
  hasApproved: {
    type: Boolean,
    default: false,
  },
  bookingTitle: {
    type: String,
    required: true,
  },
  interviewTechStacks: {
    type: [String],
    required: true,
  },
});

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
