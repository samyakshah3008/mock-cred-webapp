import jwt from "jsonwebtoken";
import { model, Schema } from "mongoose";
import { availabilitySchema } from "./availibility.model.js";

const bookingDetailsSchema = new Schema(
  {
    additionalInfo: {
      type: String,
      required: false,
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
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
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
        validator: function (time) {
          return /^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
        },
        message: "Time must be in HH:MM format",
      },
    },
    endTime: {
      type: String,
      required: true,
      validate: {
        validator: function (time) {
          return /^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
        },
        message: "Time must be in HH:MM format",
      },
    },
  },
  { _id: false }
);

const bookingItemSchema = new Schema(
  {
    interviewerBookings: {
      type: [bookingDetailsSchema],
      default: [],
    },
    intervieweeBookings: {
      type: [bookingDetailsSchema],
      default: [],
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: function () {
        return !this.isGuestUser;
      },
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },

    onboardingDetails: {
      stepOne: {
        socialAccountLink: {
          type: String,
          trim: true,
          required: false,
        },
        username: {
          type: String,
          trim: true,
          required: false,
        },
        howDoUserPlanToUseApp: {
          type: String,
          trim: false,
        },
      },
      stepTwo: {
        profilePicURL: {
          type: String,
        },
        aboutText: {
          type: String,
        },
      },
      stepThree: {
        availability: {
          availabilitySchema,
        },
      },
      username: {
        type: String,
        trim: true,
        required: false,
      },
    },
    refreshToken: {
      type: String,
    },
    isGreetingModalShown: {
      type: Boolean,
      default: false,
    },
    checklistCompleteCount: {
      type: Number,
      default: 1,
    },
    isOnboardingComplete: {
      type: Boolean,
      default: false,
    },
    bookingData: {
      type: bookingItemSchema,
      default: {
        interviewerBookings: [],
        intervieweeBookings: [],
      },
    },
    googleOAuthToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = model("User", userSchema);
