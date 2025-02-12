import { deleteRequest, get, postWithToken, put } from "@/config/API";
import {
  organizerServiceEndpoint,
  servicesEndpoint,
  testimonialsPublicProfileEndpoint,
} from "@/constants/APIEndpoints";

const fetchAllEventsService = async () => {
  const response = await get(servicesEndpoint);
  return response;
};

const fetchAllOrganizerEventsService = async (userId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${organizerServiceEndpoint}?userId=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const result = await res.json();
  return result;
};

const fetchAllTestimonialsService = async (userId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${testimonialsPublicProfileEndpoint}?userId=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const result = await res.json();
  return result;
};

const createNewEventService = async (eventFormDetails: any) => {
  const response = await postWithToken(servicesEndpoint, {
    myServiceItem: eventFormDetails,
  });
  return response;
};

const updateEventService = async (eventFormDetails: any) => {
  const response = await put(servicesEndpoint, {
    myServiceItem: eventFormDetails,
  });
  return response;
};

const deleteEventService = async (eventId: any, userRole: string) => {
  const response = await deleteRequest(servicesEndpoint, {
    role: userRole,
    serviceId: eventId,
  });
  return response;
};

export {
  createNewEventService,
  deleteEventService,
  fetchAllEventsService,
  fetchAllOrganizerEventsService,
  fetchAllTestimonialsService,
  updateEventService,
};
