import { model, Schema } from "mongoose";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 5,
    },
  },
  {
    timestamps: true,
  }
);

async function sendVerificationEmail(email, otp) {
  try {
    await mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
          <p>Here is your OTP code: ${otp}</p>`
    );
  } catch (err) {
    console.error("Error occurred while sending email: ", err);
  }
}

otpSchema.pre("save", async function (next) {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

export const OTP = model("OTP", otpSchema);
