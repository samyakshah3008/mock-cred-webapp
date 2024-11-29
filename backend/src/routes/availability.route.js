import { Router } from "express";
import {
  getUserAvailability,
  updateUserAvaibility,
} from "../controllers/availability.controller.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.get("/", verifyJWT, getUserAvailability);
router.put("/", verifyJWT, updateUserAvaibility);

export default router;
