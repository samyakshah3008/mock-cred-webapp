import { MyServicesList } from "../models/my-services.model.js";
import {
  addNewServiceToServicesListOfUserService,
  deleteParticularItemFromServicesListOfUserService,
  getServicesOfUserService,
  updateParticularServiceItemFromServicesListOfUserService,
} from "../services/my-services.service.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getServicesOfUser = asyncHandler(async (req, res) => {
  const user = req?.user;
  try {
    const response = await getServicesOfUserService(user);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "something went wrong fetching my services list items of user"
        )
      );
  }
});

const getOrganizerServices = asyncHandler(async (req, res) => {
  const userId = req?.query?.userId;
  try {
    const findUser = await MyServicesList.findOne({ userId });
    if (!findUser) {
      return res
        .status(404)
        .json(
          new ApiError(404, { message: "User not found" }, "User not found")
        );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          findUser,
          "Successfully fetched organizer services"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "something went wrong fetching organizer services"
        )
      );
  }
});

const addNewServiceToServicesListOfUser = asyncHandler(async (req, res) => {
  const { myServiceItem } = req.body;
  const user = req?.user;
  const {
    title,
    meetingNotes,
    duration,
    isPrivate,
    url,
    yoe,
    technologies,
    role,
    locationURL,
  } = myServiceItem;

  if (
    !title?.length ||
    !meetingNotes?.length ||
    !duration ||
    !url?.length ||
    yoe == undefined ||
    !technologies?.length ||
    !role?.length ||
    isPrivate == undefined ||
    !locationURL?.length
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await addNewServiceToServicesListOfUserService(
      user,
      myServiceItem
    );
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          { message: error?.message },
          "something went wrong adding item to my services list"
        )
      );
  }
});

const updateParticularServiceItemFromServicesListOfUser = asyncHandler(
  async (req, res) => {
    const { myServiceItem } = req.body;
    const user = req?.user;
    const {
      title,
      meetingNotes,
      duration,
      isPrivate,
      url,
      yoe,
      technologies,
      role,
    } = myServiceItem;

    if (
      !title?.length ||
      !meetingNotes?.length ||
      !duration ||
      !url?.length ||
      yoe == undefined ||
      !technologies?.length ||
      !role?.length ||
      isPrivate == undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      const response =
        await updateParticularServiceItemFromServicesListOfUserService(
          user,
          myServiceItem
        );
      return res.status(200).json(response);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            { message: error?.message },
            "something went wrong updating item to my services list"
          )
        );
    }
  }
);

const deleteParticularItemFromServicesListOfUser = asyncHandler(
  async (req, res) => {
    const { serviceId, role } = req.query;
    const user = req?.user;

    try {
      const response = await deleteParticularItemFromServicesListOfUserService(
        user,
        serviceId,
        role
      );
      return res.status(200).json(response);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error);
      }
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            { message: error?.message },
            "something went wrong updating item to my services list"
          )
        );
    }
  }
);

export {
  addNewServiceToServicesListOfUser,
  deleteParticularItemFromServicesListOfUser,
  getOrganizerServices,
  getServicesOfUser,
  updateParticularServiceItemFromServicesListOfUser,
};
