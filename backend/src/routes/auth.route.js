import { Router } from "express";
import {
  signinUserController,
  signupUserController,
  verifyOTPAndRegisterUserController,
  verifyOTPAndSigninUserController,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/signup").post(signupUserController);
router.route("/signup/verify-otp").post(verifyOTPAndRegisterUserController);
router.route("/signin").post(signinUserController);
router.route("/signin/verify-otp").post(verifyOTPAndSigninUserController);

export default router;
