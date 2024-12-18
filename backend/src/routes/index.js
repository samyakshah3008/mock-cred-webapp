import { Router } from "express";
import aiMockInterviewRouter from "./ai-mock-interview.route.js";
import authRouter from "./auth.route.js";
import availabilityRouter from "./availability.route.js";
import eventsRouter from "./event.route.js";
import notesRouter from "./note.route.js";
import userRouter from "./user.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/notes", notesRouter);
router.use("/availability", availabilityRouter);
router.use("/events", eventsRouter);
router.use("/ai-mock-interview", aiMockInterviewRouter);

export default router;
