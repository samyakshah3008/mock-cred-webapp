import { model, Schema } from "mongoose";

export const daySchema = new Schema({
  isAvailable: { type: Boolean, required: true },
  startTime: { type: String },
  endTime: { type: String },
});

export const availabilitySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timeGap: { type: Number, required: true, min: 0 },
  monday: { type: daySchema, required: true },
  tuesday: { type: daySchema, required: true },
  wednesday: { type: daySchema, required: true },
  thursday: { type: daySchema, required: true },
  friday: { type: daySchema, required: true },
  saturday: { type: daySchema, required: true },
  sunday: { type: daySchema, required: true },
});

const Availability = model("Availability", availabilitySchema);

export default Availability;
