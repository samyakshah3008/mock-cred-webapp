import { Router } from "express";
import {
  addNewAIMockInterview,
  deleteAIMockInterview,
  getUserAIMockInterviewsData,
} from "../controllers/ai-mock-interview.controller.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.get("/", verifyJWT, getUserAIMockInterviewsData);
router.post("/", verifyJWT, addNewAIMockInterview);
router.delete("/", verifyJWT, deleteAIMockInterview);

export default router;
