import { Router } from "express";
import {
  addNewBooking,
  approveBooking,
  changeBookingStatus,
  findBookedSlots,
  getAllBookings,
} from "../controllers/booking.controller.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.get("/", verifyJWT, getAllBookings);
router.post("/", verifyJWT, addNewBooking);
router.post("/change-status", verifyJWT, changeBookingStatus);
router.post("/approve", verifyJWT, approveBooking);

router.get("/find-booked-slots", verifyJWT, findBookedSlots);

// router.put("/", verifyJWT, updateParticularServiceItemFromServicesListOfUser);
// router.delete("/", verifyJWT, deleteParticularItemFromServicesListOfUser);

export default router;
