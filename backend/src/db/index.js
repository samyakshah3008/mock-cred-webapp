import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
  path: ".env",
});

const DB_URI = process.env.MONGODB_URI;

const connectToDB = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://samyakshah3008:145Orjkk3kYRIhTs@cluster0.n8frl.mongodb.net/MOCK_CRED_DB"
      )
      .then((data) => {
        console.log(`Database connected with`, DB_URI);
      });
  } catch (error) {
    console.log(error?.message);
  }
};

export default connectToDB;
