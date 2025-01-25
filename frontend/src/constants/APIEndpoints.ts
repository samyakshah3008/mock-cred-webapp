// authentication - signin
export const sendOTPToSigningInUserEndpoint = "/auth/signin";
export const verifyOTPToSigningInUserEndpoint = "/auth/signin/verify-otp";

// authentication - signup
export const sendOTPToSigningUpUserEndpoint = "/auth/signup";
export const verifyOTPTOSigningUpUserEndpoint = "/auth/signup/verify-otp";

export const refreshAccessTokenEndpoint = "/auth/refresh-access-token";
export const userDetailsEndpoint = "/user";
export const checkUserOnboardedEndpoint = "/user/check-onboarding";

export const saveUserOnboardingDetails = "/user/save-onboarding-details";
export const saveUserOnboardingDetailsStepTwo =
  "/user/save-onboarding-details/step-two";

export const aiMockInterviewDetailsEndpoint = "/ai-mock-interview";

export const getServiceDetailsEndpoint = "/user/get-service-details";
export const userEndpoint = "/user/get-user-details";

export const availabilityEndpoint = "/availability";

export const servicesEndpoint = "/services";

export const bookingEndpoint = "/booking";

export const bookingChangeStatusEndpoint = "/booking/change-status";

export const organizerServiceEndpoint = "/services/organizer";

export const approveBookingEndpoint = "/booking/approve";

export const testimonialEndpoint = "/testimonials";
