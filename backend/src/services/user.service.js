import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";

const getUserDetailsService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, { message: "User not found" }, "User not found");
  }

  return user;
};

const checkIfOnboardingCompletedOrNotService = async (userId) => {
  const user = await User.findById(userId);

  if (user?.isOnboardingComplete) {
    return { isOnboardingComplete: true };
  } else {
    return { isOnboardingComplete: false };
  }
};

export { checkIfOnboardingCompletedOrNotService, getUserDetailsService };
