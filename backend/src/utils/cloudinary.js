import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
// import fs from "fs";

dotenv.config({
  path: ".env",
});

console.log("env from cloudinary", process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     return response;
//   } catch (error) {
//     // if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
//     return null;
//   }
// };

const uploadOnCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) return reject("No file provided");

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result); // Return the result properly
      }
    );

    stream.end(fileBuffer); // Send the buffer data to Cloudinary
  });
};

export { uploadOnCloudinary };
