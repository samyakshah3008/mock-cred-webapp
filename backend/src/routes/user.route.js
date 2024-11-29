import { Router } from "express";
import {
  checkIfOnboardingCompletedOrNot,
  getUserDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();
router.get("/", verifyJWT, getUserDetails);
router.get("/check-onboarding", verifyJWT, checkIfOnboardingCompletedOrNot);

export default router;
