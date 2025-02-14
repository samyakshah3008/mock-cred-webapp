import { ApiError } from "../utils/api-error.js";

const logError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ApiError(400, message);
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ApiError(400, message);
  }

  if (err.name === "JsonWebTokenError") {
    const message = `JSON web token is invalid, please check the token. `;
    err = new ApiError(400, message);
  }

  if (err.name === "TokenExpiredError") {
    const message = `JSON web token is expired, please refresh the token.`;
    err = new ApiError(400, message);
  }

  return res
    .status(err.statusCode)
    .json({ success: false, message: err.message });
};

export { logError };
