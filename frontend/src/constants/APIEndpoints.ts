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

export const testimonialsPublicProfileEndpoint = "/testimonials/public-profile";

export const editTestimonialVisibilityEndpoint =
  "/testimonials/edit-visibility";

export const updateTestimonialEndpoint = "/testimonials/update";

export const fetchListServiceEndpoint = "/user/get-user-by-role";

export const findBookedSlotsServiceEndpoint = "/booking/find-booked-slots";

export const getAggregateStatisticsByUsernameEndpoint =
  "/user/get-aggregate-statistics";

export const fetchUsersForMockInterviewsServiceEndpoint =
  "/user/find-match-users";

// update email endpoint:

export const updateEmailEndpoint = "/user/change-email/send-otp";
export const verifyOTPAndUpdateEmailEndpoint = "/user/change-email/verify-otp";

export const editSocialLinksEndpoint = "/user/change-social-account-links";
export const editProfilePicEndpoint = "/user/change-profile-picture";
export const editBasicDetailsEndpoint = "/user/change-basic-details";
export const editTechnicalDetailsEndpoint = "/user/change-technical-details";
