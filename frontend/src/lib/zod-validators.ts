import { z } from "zod";

// Define schema and type for username
export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or less")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
});
export type UsernameSchemaType = z.infer<typeof usernameSchema>;

// Define schema and type for day availability
export const daySchema = z
  .object({
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isAvailable) {
        return data.startTime && data.endTime && data.startTime < data.endTime;
      }
      return true;
    },
    {
      message: "End time must be more than start time",
      path: ["endTime"],
    }
  );
export type DaySchemaType = z.infer<typeof daySchema>;

// Define schema and type for weekly availability
export const availabilitySchema = z.object({
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
  timeGap: z.number().min(0, "Time gap must be 0 or more minutes").int(),
});
export type AvailabilitySchemaType = z.infer<typeof availabilitySchema>;

// Define schema and type for event
export const serviceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
  duration: z
    .number()
    .int()
    .positive("Duration must be a positive number")
    .min(15, "Minimum 15minutes is required.")
    .max(180, "You should not take mock interview above 3 hours!"),
  isPrivate: z.boolean(),
});
export type ServiceSchemaType = z.infer<typeof serviceSchema>;

// Define schema and type for booking
export const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  additionalInfo: z.string().optional(),
});
export type BookingSchemaType = z.infer<typeof bookingSchema>;
