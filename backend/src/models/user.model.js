import jwt from "jsonwebtoken";
import { model, Schema } from "mongoose";
import { daySchema } from "./availability.model.js";

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
          unique: true,
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
          timeGap: { type: Number, min: 0 },
          monday: { type: daySchema },
          tuesday: { type: daySchema },
          wednesday: { type: daySchema },
          thursday: { type: daySchema },
          friday: { type: daySchema },
          saturday: { type: daySchema },
          sunday: { type: daySchema },
        },
      },
      stepFour: {
        socialLinks: {
          linkedIn: {
            type: String,
          },
          github: {
            type: String,
          },
          X: {
            type: String,
          },
          instagram: {
            type: String,
          },
          peerlist: {
            type: String,
          },
        },
      },
      stepFive: {
        position: {
          type: String,
        },
        company: {
          type: String,
        },
        preferredTechStack: [String],
        yearsOfExperience: {
          type: Number,
        },
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
    googleOAuthToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["interviewer", "interviewee", "allrounder"],
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
