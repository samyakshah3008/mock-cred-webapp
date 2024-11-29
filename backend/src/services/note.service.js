import mongoose from "mongoose";
import { MyNotesList } from "../models/notes.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getNotesOfUserService = async (user) => {
  const userId = new mongoose.Types.ObjectId(user?._id);

  const myNotesList = await MyNotesList.findOne({ userId });

  return new ApiResponse(
    200,
    { myNotes: myNotesList?.notes || [] },
    "Successfully fetched my services items"
  );
};

const addNewNoteToNotesListOfUserService = async (user, myNoteItem) => {
  const {
    title,
    description,
    interviewDetails,
    questionsAsked,
    thingsToImprove,
  } = myNoteItem;

  const newMyNoteItem = {
    title,
    description,
    interviewDetails,
    questionsAsked,
    thingsToImprove,
  };

  let myNotesList = await MyNotesList.findOne({ userId: user?._id });

  if (!myNotesList) {
    myNotesList = new MyNotesList({
      userId: user?._id,
      notes: [newMyNoteItem],
    });
  } else {
    myNotesList.notes.push(newMyNoteItem);
  }

  await myNotesList.save();

  return new ApiResponse(
    201,
    { message: "Successfully added item to notes list" },
    "Successfully added item to notes list"
  );
};

const updateParticularNoteFromNotesListOfUserService = async (
  user,
  noteObj,
  noteId
) => {
  const {
    title,
    description,
    interviewDetails,
    questionsAsked,
    thingsToImprove,
  } = noteObj;

  const notesList = await MyNotesList.findOne({ userId: user._id });

  if (!notesList) {
    throw new ApiError(
      404,
      { errorData: "Notes list is empty for this user." },
      "Notes list is empty for this user."
    );
  }

  const particularNote = notesList.notes.id(noteId);

  if (!particularNote) {
    throw new ApiError(
      404,
      { errorData: "Note not found." },
      "Note not found."
    );
  }

  if (title !== undefined) particularNote.title = title;
  if (description !== undefined) particularNote.description = description;
  if (interviewDetails !== undefined)
    particularNote.interviewDetails = interviewDetails;
  if (questionsAsked !== undefined)
    particularNote.questionsAsked = questionsAsked;
  if (thingsToImprove !== undefined)
    particularNote.thingsToImprove = thingsToImprove;
  particularNote.updatedAt = new Date();

  await notesList.save();

  return new ApiResponse(
    200,
    { message: "Successfully updated note in notes list" },
    "Successfully updated note in notes list"
  );
};

const deleteParticularNoteFromNotesListOfUserService = async (user, noteId) => {
  const notesList = await MyNotesList.findOne({ userId: user._id });

  if (!notesList) {
    throw new ApiError(
      404,
      {
        errorData: "Notes list is empty for this user.",
      },
      "Notes list is empty for this user."
    );
  }

  const particularNote = notesList.notes.id(noteId);

  if (!particularNote) {
    throw new ApiError(
      404,
      { errorData: "Note not found!" },
      "Note not found!"
    );
  }

  await particularNote.deleteOne();
  await notesList.save();

  return new ApiResponse(
    200,
    { message: "Successfully deleted note from notes list" },
    "Successfully deleted note from notes list"
  );
};

export {
  addNewNoteToNotesListOfUserService,
  deleteParticularNoteFromNotesListOfUserService,
  getNotesOfUserService,
  updateParticularNoteFromNotesListOfUserService,
};
