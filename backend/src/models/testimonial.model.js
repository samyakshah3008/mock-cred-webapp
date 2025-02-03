import mongoose from "mongoose";

const Schema = mongoose.Schema;

const EachTestimonialSchema = new Schema({
  rating: { type: Number, max: 5, required: true },
  testimonialText: { type: String, required: true },
  testimonialGiverName: { type: String, required: true },
  testimonialGiverPublicProfile: { type: String, required: true },
  date: { type: String },
  showOnProfile: { type: Boolean, default: true },
  testimonialId: { type: String, required: true },
  interviewDetails: {
    date: { type: String, required: true },
    interviewerName: { type: String, required: true },
    intervieweeName: { type: String, required: true },
    interviewTitle: { type: String, required: true },
    interviewTechStacks: { type: [String], required: true },
    interviewBookingLink: { type: String, required: true },
  },
});

const myGivenTestimonialSchema = new Schema({
  rating: { type: Number, max: 5, required: true },
  testimonialText: { type: String, required: true },
  feedbackText: { type: String, required: true },
  date: { type: String },
  testimonialReceiverUserId: { type: String, required: true },
  testimonialId: { type: String, required: true },
  testimonialReceiverUsername: { type: String, required: true },
});

const TestimonialSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  intervieweeTestimonials: { type: [EachTestimonialSchema], default: [] },
  interviewerTestimonials: { type: [EachTestimonialSchema], default: [] },
  myGivenTestimonials: { type: [myGivenTestimonialSchema], default: [] },
});

export const Testimonial = mongoose.model("Testimonial", TestimonialSchema);
