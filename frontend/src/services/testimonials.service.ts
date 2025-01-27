import { deleteRequest, get, postWithToken } from "@/config/API";
import {
  editTestimonialVisibilityEndpoint,
  testimonialEndpoint,
  updateTestimonialEndpoint,
} from "@/constants/APIEndpoints";

const fetchTestimonialsService = async (role: string) => {
  const response = get(`${testimonialEndpoint}?role=${role}`);
  return response;
};

const editVisibilityService = async (
  testimonialId: string,
  currentRole: string,
  showOnProfile: boolean
) => {
  const response = await postWithToken(editTestimonialVisibilityEndpoint, {
    testimonialId,
    role: currentRole,
    showOnProfile,
  });
  return response;
};

const updateTestimonialService = async (testimonialData: any) => {
  const response = await postWithToken(updateTestimonialEndpoint, {
    ...testimonialData,
  });
  return response;
};

const deleteTestimonialService = async (
  testimonialId: string,
  testimonialReceiverUserId: string
) => {
  const response = await deleteRequest(
    `${testimonialEndpoint}?testimonialId=${testimonialId}&testimonialReceiverUserId=${testimonialReceiverUserId}`
  );
  return response;
};

export {
  deleteTestimonialService,
  editVisibilityService,
  fetchTestimonialsService,
  updateTestimonialService,
};
