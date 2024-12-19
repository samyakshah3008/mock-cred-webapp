import {
  addNewServiceToServicesListOfUserService,
  deleteParticularItemFromServicesListOfUserService,
  getServicesOfUserService,
  updateParticularServiceItemFromServicesListOfUserService,
} from "../services/my-services.service.js";
import { ApiError } from "../utils/api-error.js";
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

const addNewServiceToServicesListOfUser = asyncHandler(async (req, res) => {
  const { myServiceItem } = req.body;
  const user = req?.user;
  const { title, meetingNotes, duration, isPrivate, url } = myServiceItem;

  if (!title?.length || !meetingNotes?.length || !duration || !url) {
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
    const { title, meetingNotes, duration, isPrivate, url } = myServiceItem;

    if (!title?.length || !meetingNotes?.length || !duration || !url) {
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
    const { serviceId } = req.query;
    const user = req?.user;

    try {
      const response = await deleteParticularItemFromServicesListOfUserService(
        user,
        serviceId
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
  getServicesOfUser,
  updateParticularServiceItemFromServicesListOfUser,
};
