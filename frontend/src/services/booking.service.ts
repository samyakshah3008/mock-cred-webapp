import { postWithToken } from "@/config/API";
import {
  approveBookingEndpoint,
  bookingChangeStatusEndpoint,
  bookingEndpoint,
} from "@/constants/APIEndpoints";

const bookNewInterviewService = async (bookingData: any) => {
  const response = await postWithToken(bookingEndpoint, { bookingData });
  return response;
};

const bookingChangeStatusService = async (
  status: string,
  role: string,
  meetingId: string,
  reason: string,
  bookingLink: string
) => {
  const response = await postWithToken(bookingChangeStatusEndpoint, {
    status,
    meetingId,
    role,
    reason,
    bookingLink,
  });
  return response;
};

const approveBookingService = async (
  meetingId: any,
  role: any,
  testimonialText: any,
  rating: any,
  feedbackText: any,
  interviewDetails: any
) => {
  const response = await postWithToken(approveBookingEndpoint, {
    meetingId,
    role,
    testimonialText,
    rating,
    feedbackText,
    testimonialGiverPublicProfile: "http://localhost:3000/samyaksshah",
    interviewDetails,
  });

  return response;
};

export {
  approveBookingService,
  bookingChangeStatusService,
  bookNewInterviewService,
};
