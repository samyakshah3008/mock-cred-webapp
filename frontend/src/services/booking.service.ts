import { postWithToken } from "@/config/API";
import { bookingEndpoint } from "@/constants/APIEndpoints";

const bookNewInterviewService = async (bookingData: any) => {
  const response = await postWithToken(bookingEndpoint, { bookingData });
  return response;
};

export { bookNewInterviewService };
