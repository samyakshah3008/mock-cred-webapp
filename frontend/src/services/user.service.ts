import { get, postWithToken } from "@/config/API";
import {
  checkUserOnboardedEndpoint,
  fetchListServiceEndpoint,
  fetchUsersForMockInterviewsServiceEndpoint,
  findBookedSlotsServiceEndpoint,
  getAggregateStatisticsByUsernameEndpoint,
  updateEmailEndpoint,
  verifyOTPAndUpdateEmailEndpoint,
} from "@/constants/APIEndpoints";

const checkIfOnboardingCompletedOrNot = async (userId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}${checkUserOnboardedEndpoint}?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await res.json();
    return result;
  } catch (err) {
    throw err;
  }
};

const fetchListService = async (requiredRole: string) => {
  try {
    const res = await get(fetchListServiceEndpoint, { role: requiredRole });
    return res;
  } catch (error) {
    throw error;
  }
};

const findBookedSlotsService = async (
  username: string,
  role: string,
  date: string
) => {
  try {
    const res = await get(findBookedSlotsServiceEndpoint, {
      username,
      role,
      date,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

const getAggregateStatisticsByUsername = async (username: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}${getAggregateStatisticsByUsernameEndpoint}?username=${username}`
    )
      .then((data) => data.json())
      .then((data) => {
        return data;
      });
    return res?.data?.aggregateStatistics;
  } catch (error) {
    throw error;
  }
};

const fetchUsersForMockInterviewsService = async (requiredRole: string) => {
  try {
    const res = await get(fetchUsersForMockInterviewsServiceEndpoint, {
      requiredRole,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

const verifyUpdatingEmailAndSendOTPService = async (email: string) => {
  const response = await postWithToken(updateEmailEndpoint, { email });
  return response;
};

const verifyOTPAndUpdateEmailService = async (email: string, otp: string) => {
  const response = await postWithToken(verifyOTPAndUpdateEmailEndpoint, {
    email,
    otp,
  });
  return response;
};

export {
  checkIfOnboardingCompletedOrNot,
  fetchListService,
  fetchUsersForMockInterviewsService,
  findBookedSlotsService,
  getAggregateStatisticsByUsername,
  verifyOTPAndUpdateEmailService,
  verifyUpdatingEmailAndSendOTPService,
};
