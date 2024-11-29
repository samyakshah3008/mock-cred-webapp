import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const getEventsOfUser = asyncHandler(async (req, res) => {
  const user = req?.user;
  try {
    const response = await getEventsOfUserService(user);
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
          "something went wrong fetching get my services list items of user"
        )
      );
  }
});

const addNewEventToEventListOfUser = asyncHandler(async (req, res) => {
  const { myEventItem } = req.body;
  const user = req?.user;
  const { title, description, duration, isPrivate } = myEventItem;

  if (!title?.length || !description?.length || !duration) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await addNewServiceToServicesListOfUserService(
      user,
      myEventItem
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

const updateParticularEventItemFromEventsListOfUser = asyncHandler(
  async (req, res) => {
    const { myEventItem, myEventItemid } = req.body;
    const user = req?.user;
    const { title, description, duration, isPrivate } = myEventItem;

    if (
      !myEventItemid?.length ||
      !title?.length ||
      !description?.length ||
      !duration
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const response =
        await updateParticularServiceItemFromServicesListOfUserService(
          user,
          myEventItem,
          myEventItemid
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

const deleteParticularItemFromEventsListOfUser = asyncHandler(
  async (req, res) => {
    const { eventItemId } = req.query;
    const user = req?.user;

    try {
      const response = await deleteParticularItemFromServicesListOfUserService(
        user,
        eventItemId
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
  addNewEventToEventListOfUser,
  deleteParticularItemFromEventsListOfUser,
  getEventsOfUser,
  updateParticularEventItemFromEventsListOfUser,
};
