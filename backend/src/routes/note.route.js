import { Router } from "express";
import {
  addNewNoteToNotesListOfUser,
  deleteParticularNoteFromNotesListOfUser,
  getNotesOfUser,
  updateParticularNoteFromNotesListOfUser,
} from "../controllers/note.controller.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.get("/", verifyJWT, getNotesOfUser);
router.post("/", verifyJWT, addNewNoteToNotesListOfUser);
router.put("/", verifyJWT, updateParticularNoteFromNotesListOfUser);
router.delete("/", verifyJWT, deleteParticularNoteFromNotesListOfUser);

export default router;
