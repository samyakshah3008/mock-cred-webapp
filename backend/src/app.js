import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { logError } from "./middleware/log-error.js";
import router from "./routes/index.js";

dotenv.config({
  path: ".env",
});

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.get("/helloworld", (req, res) => {
  res.send("Hello, world!");
});

app.use(logError);

app.use("/api/v1", router);

export { app };
