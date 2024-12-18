import { get, postWithToken } from "@/config/API";
import { aiMockInterviewDetailsEndpoint } from "@/constants/APIEndpoints";

const fetchAIMockInterviewDetailsService = async () => {
  const response = await get(aiMockInterviewDetailsEndpoint);
  return response;
};

const addNewEntryToDBService = async (payload: any) => {
  const response = await postWithToken(aiMockInterviewDetailsEndpoint, payload);
  return response;
};

const getMockInterviewDetailsService = async (id: string) => {
  const response = await get(`${aiMockInterviewDetailsEndpoint}/${id}`);
  return response;
};

export {
  addNewEntryToDBService,
  fetchAIMockInterviewDetailsService,
  getMockInterviewDetailsService,
};
