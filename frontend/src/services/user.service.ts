import { get } from "@/config/API";
import {
  checkUserOnboardedEndpoint,
  fetchListServiceEndpoint,
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

export { checkIfOnboardingCompletedOrNot, fetchListService };
