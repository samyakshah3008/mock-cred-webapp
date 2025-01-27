import { Router } from "express";
import {
  addNewServiceToServicesListOfUser,
  deleteParticularItemFromServicesListOfUser,
  getOrganizerServices,
  getServicesOfUser,
  updateParticularServiceItemFromServicesListOfUser,
} from "../controllers/my-services.controller.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

router.get("/", verifyJWT, getServicesOfUser);
router.get("/organizer", verifyJWT, getOrganizerServices);
router.post("/", verifyJWT, addNewServiceToServicesListOfUser);
router.put("/", verifyJWT, updateParticularServiceItemFromServicesListOfUser);
router.delete("/", verifyJWT, deleteParticularItemFromServicesListOfUser);

export default router;
