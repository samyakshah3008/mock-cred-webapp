import { get } from "@/config/API";
import { testimonialEndpoint } from "@/constants/APIEndpoints";

const fetchTestimonialsService = async (role: string) => {
  const response = get(`${testimonialEndpoint}?role=${role}`);
  return response;
};

export { fetchTestimonialsService };
