import dotenv from "dotenv";
import app from "./app.js";
import connectToDB from "./db/index.js";

dotenv.config({
  path: ".env",
});

// app.listen(process.env.PORT, () => {
//   console.log(`Server is connected with port`);
//   connectToDB();
// });

connectToDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port`);
    });
  })
  .catch((error) => {
    console.error("Something went wrong to the root of the service", error);
  });
