import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
  path: ".env",
});

const DB_URI = process.env.MONGODB_URI;

const connectToDB = async () => {
  try {
    await mongoose.connect(DB_URI).then((data) => {
      console.log(`Database connected with`, DB_URI);
    });
  } catch (error) {
    console.log(error?.message);
  }
};

export { connectToDB };
