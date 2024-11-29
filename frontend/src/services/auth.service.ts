import { postWithoutToken } from "@/config/API";
import {
  sendOTPToSigningInUserEndpoint,
  sendOTPToSigningUpUserEndpoint,
  verifyOTPToSigningInUserEndpoint,
  verifyOTPTOSigningUpUserEndpoint,
} from "@/constants/APIEndpoints";

export const verifyExistingUserAndSendOTPService = async (payload: {}) => {
  const response = await postWithoutToken(
    sendOTPToSigningInUserEndpoint,
    payload
  );
  return response;
};

export const verifyOTPAndSignInUserService = async (payload: {}) => {
  const response = await postWithoutToken(
    verifyOTPToSigningInUserEndpoint,
    payload
  );
  return response;
};

export const verifyNewUserAndSendOTPService = async (payload: {}) => {
  const response = await postWithoutToken(
    sendOTPToSigningUpUserEndpoint,
    payload
  );
  return response;
};

export const verifyOTPAndSignUpUserService = async (payload: {}) => {
  const response = await postWithoutToken(
    verifyOTPTOSigningUpUserEndpoint,
    payload
  );
  return response;
};
