import cookieParser from "cookie-parser";
import cors from "cors";
// import dotenv from "dotenv";
import express from "express";
import { logError } from "./middleware/log-error.js";
import router from "./routes/index.js";

// dotenv.config({
//   path: ".env",
// });

const app = express();

console.log(process.env.CORS_ORIGIN, "env");

app.options(
  "",
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/helloworld", (req, res) => {
  res.send("Hello, world!");
});

app.use(logError);

app.use("/api/v1", router);

export default app;
