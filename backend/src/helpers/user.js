import { User } from "../models/user.model.js";

const isEmailExists = async (email, userId) => {
  const findEmail = await User.findOne({ email, _id: { $ne: userId } });
  if (findEmail) {
    return true;
  } else {
    return false;
  }
};

const isUsernameExists = async (username, userId) => {
  const findUsername = await User.findOne({
    "onboardingDetails.stepOne.username": username,
    _id: { $ne: userId },
  });
  if (findUsername) {
    return true;
  }
  return false;
};

export { isEmailExists, isUsernameExists };
