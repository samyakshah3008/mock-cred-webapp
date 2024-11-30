import { checkUserOnboardedEndpoint } from "@/constants/APIEndpoints";

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

export { checkIfOnboardingCompletedOrNot };
