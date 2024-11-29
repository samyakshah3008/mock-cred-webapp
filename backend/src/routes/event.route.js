import { Router } from "express";
import {
  addNewEventToEventListOfUser,
  deleteParticularItemFromEventsListOfUser,
  getEventsOfUser,
  updateParticularEventItemFromEventsListOfUser,
} from "../controllers/event.controller.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.get("/", verifyJWT, getEventsOfUser);
router.post("/", verifyJWT, addNewEventToEventListOfUser);
router.put("/", verifyJWT, updateParticularEventItemFromEventsListOfUser);
router.delete("/", verifyJWT, deleteParticularItemFromEventsListOfUser);

export default router;
