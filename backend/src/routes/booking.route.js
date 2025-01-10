import { Router } from "express";
import {
  addNewBooking,
  getAllBookings,
} from "../controllers/booking.controller.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.get("/", verifyJWT, getAllBookings);
router.post("/", verifyJWT, addNewBooking);
// router.put("/", verifyJWT, updateParticularServiceItemFromServicesListOfUser);
// router.delete("/", verifyJWT, deleteParticularItemFromServicesListOfUser);

export default router;
