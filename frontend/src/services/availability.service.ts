import { get, put } from "@/config/API";
import { availabilityEndpoint } from "@/constants/APIEndpoints";

const fetchAvailabilityDetailsService = async () => {
  const response = await get(availabilityEndpoint);
  return response;
};

const updateAvailabilityService = async (availability: any) => {
  const response = await put(availabilityEndpoint, { data: availability });
  return response;
};

export { fetchAvailabilityDetailsService, updateAvailabilityService };
