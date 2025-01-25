import { deleteRequest, get, postWithToken, put } from "@/config/API";
import {
  organizerServiceEndpoint,
  servicesEndpoint,
} from "@/constants/APIEndpoints";

const fetchAllEventsService = async () => {
  const response = await get(servicesEndpoint);
  return response;
};

const fetchAllOrganizerEventsService = async (userId: string) => {
  const response = await get(`${organizerServiceEndpoint}?userId=${userId}`);
  return response;
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

const deleteEventService = async (eventId: any) => {
  const response = await deleteRequest(
    `${servicesEndpoint}?serviceId=${eventId}`
  );
  return response;
};

export {
  createNewEventService,
  deleteEventService,
  fetchAllEventsService,
  fetchAllOrganizerEventsService,
  updateEventService,
};
