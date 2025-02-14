import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

console.log("env from cloudinary", process.env.CLOUDINARY_CLOUD_NAME);

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinaryConfig };
