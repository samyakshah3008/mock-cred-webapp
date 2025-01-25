import { Router } from "express";
import { getAllTestimonials } from "../controllers/testimonial.controller.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.get("/", verifyJWT, getAllTestimonials);

export default router;
