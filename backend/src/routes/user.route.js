import { Router } from "express";
import {
  checkIfOnboardingCompletedOrNot,
  fetchUsersAccordingToRole,
  getCustomUserPageInformation,
  getServiceByUsernameAndId,
  getUserDetails,
  saveOnboardingDetails,
  saveStepTwoOnboardingDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.get("/", verifyJWT, getUserDetails);
router.get("/get-user-details", getCustomUserPageInformation);
router.get("/get-service-details", getServiceByUsernameAndId);
router.get("/check-onboarding", checkIfOnboardingCompletedOrNot);
router.post("/save-onboarding-details", verifyJWT, saveOnboardingDetails);
router.post(
  "/save-onboarding-details/step-two",
  verifyJWT,
  upload.single("profilePic"),
  saveStepTwoOnboardingDetails
);
router.get("/get-user-by-role", verifyJWT, fetchUsersAccordingToRole);

export default router;
