import mongoose from "mongoose";

const Schema = mongoose.Schema;

const EachTestimonialSchema = new Schema({
  rating: { type: Number, max: 5, required: true },
  testimonialText: { type: String, required: true },
  testimonialGiverName: { type: String, required: true },
  testimonialGiverPublicProfile: { type: String, required: true },
  date: { type: String },
  showOnProfile: { type: Boolean, default: true },
});

const myGivenTestimonialSchema = new Schema({
  rating: { type: Number, max: 5, required: true },
  testimonialText: { type: String, required: true },
  feedbackText: { type: String, required: true },
  date: { type: String },
  testimonialReceiverUserId: { type: String, required: true },
});

const TestimonialSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  intervieweeTestimonials: { type: [EachTestimonialSchema], default: [] },
  interviewerTestimonials: { type: [EachTestimonialSchema], default: [] },
  myGivenTestimonials: { type: [myGivenTestimonialSchema], default: [] },
});

export const Testimonial = mongoose.model("Testimonial", TestimonialSchema);
