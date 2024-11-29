import { Router } from "express";
import authRouter from "./auth.route.js";
import notesRouter from "./note.route.js";
import userRouter from "./user.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/notes", notesRouter);

export default router;
