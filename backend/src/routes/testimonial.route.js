import { Router } from "express";
import {
  changeTestimonialVisibility,
  deleteGivenTestimonial,
  getAllTestimonials,
  updateGivenTestimonial,
} from "../controllers/testimonial.controller.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.get("/", verifyJWT, getAllTestimonials);
router.post("/edit-visibility", verifyJWT, changeTestimonialVisibility);
router.post("/update", verifyJWT, updateGivenTestimonial);
router.delete("/", verifyJWT, deleteGivenTestimonial);

export default router;
