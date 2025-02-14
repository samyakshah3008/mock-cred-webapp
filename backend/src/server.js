import dotenv from "dotenv";
import app from "./app.js";
import connectToDB from "./db/index.js";

dotenv.config({
  path: ".env",
});

app.listen(process.env.PORT, () => {
  console.log(`Server is connected with port`);
  connectToDB();
});
