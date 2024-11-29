import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

dotenv.config({
  path: ".env",
});

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req?.cookies?.accessToken ||
      req?.header("Authorization")?.replace("Bearer", "")?.trim();
    if (!token) {
      throw res.status(401).json(new ApiError(401, {}, "Unauthorized request"));
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "- refreshToken"
    );

    if (!user) {
      throw res.status(401).json(new ApiError(401, {}, "Invalid access token"));
    }

    req.user = user;
    next();
  } catch (error) {
    throw res
      .status(401)
      .json(new ApiError(401, { errorData: error }, "invalid or expired jwt"));
  }
});
