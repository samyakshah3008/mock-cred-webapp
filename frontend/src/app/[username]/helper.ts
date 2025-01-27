import {
  getServiceDetailsEndpoint,
  userEndpoint,
} from "@/constants/APIEndpoints";

export const getUserByUsername = async (username: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}${userEndpoint}?username=${username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await res.json();
    return result;
  } catch (err) {
    throw err;
  }
};

export const getServiceByUsernameAndId = async (
  username: string,
  serviceId: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${getServiceDetailsEndpoint}?username=${username}&serviceId=${serviceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await res.json();
    return result;
  } catch (err) {
    throw err;
  }
};
