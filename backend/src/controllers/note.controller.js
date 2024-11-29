import {
  addNewNoteToNotesListOfUserService,
  deleteParticularNoteFromNotesListOfUserService,
  getNotesOfUserService,
  updateParticularNoteFromNotesListOfUserService,
} from "../services/note.service.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const getNotesOfUser = asyncHandler(async (req, res) => {
  const user = req?.user;
  try {
    const response = await getNotesOfUserService(user);
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
          { errorData: error },
          error?.message ||
            "something went wrong fetching notes list items of user"
        )
      );
  }
});

const addNewNoteToNotesListOfUser = asyncHandler(async (req, res) => {
  const { myNewNote } = req.body;
  const user = req?.user;
  const {
    title,
    description,
    interviewDetails,
    questionsAsked,
    thingsToImprove,
  } = myNewNote;

  if (
    !title?.length ||
    !description?.length ||
    !interviewDetails?.length ||
    !questionsAsked?.length ||
    !thingsToImprove?.length
  ) {
    return res
      .status(400)
      .json(
        new ApiError(400, { errorData: "Missing fields" }, "Missing fields")
      );
  }

  try {
    const response = await addNewNoteToNotesListOfUserService(user, myNewNote);
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
          { errorData: error },
          error?.message || "something went wrong adding note to notes."
        )
      );
  }
});

const updateParticularNoteFromNotesListOfUser = asyncHandler(
  async (req, res) => {
    const { noteObj, noteId } = req.body;
    const user = req?.user;
    const {
      title,
      description,
      interviewDetails,
      questionsAsked,
      thingsToImprove,
    } = noteObj;

    if (
      !noteId?.length ||
      !title?.length ||
      !description?.length ||
      !interviewDetails?.length ||
      !questionsAsked?.length ||
      !thingsToImprove?.length
    ) {
      return res
        .status(400)
        .json(
          new ApiError(400, { errorData: "Missing fields" }, "Missing fields")
        );
    }

    try {
      const response = await updateParticularNoteFromNotesListOfUserService(
        user,
        noteObj,
        noteId
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
            { errorData: error },
            error?.message |
              "something went wrong updating note in my notes list"
          )
        );
    }
  }
);

const deleteParticularNoteFromNotesListOfUser = asyncHandler(
  async (req, res) => {
    const { noteId } = req.query;
    const user = req?.user;

    try {
      const response = await deleteParticularNoteFromNotesListOfUserService(
        user,
        noteId
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
            { errorData: error },
            error?.message || "something went wrong deleting item in notes list"
          )
        );
    }
  }
);

export {
  addNewNoteToNotesListOfUser,
  deleteParticularNoteFromNotesListOfUser,
  getNotesOfUser,
  updateParticularNoteFromNotesListOfUser,
};
