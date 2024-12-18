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
