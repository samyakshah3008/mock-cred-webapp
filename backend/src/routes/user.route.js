import { Router } from "express";
import {
  checkIfOnboardingCompletedOrNot,
  getUserDetails,
  saveOnboardingDetails,
  saveStepTwoOnboardingDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = Router();
router.get("/", verifyJWT, getUserDetails);
router.get("/check-onboarding", verifyJWT, checkIfOnboardingCompletedOrNot);
router.post("/save-onboarding-details", verifyJWT, saveOnboardingDetails);
router.post(
  "/save-onboarding-details/step-two",
  upload.single("profilePic"),
  saveStepTwoOnboardingDetails
);

export default router;
