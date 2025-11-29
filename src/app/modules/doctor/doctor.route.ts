import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();

router.get("/", doctorController.getAllDoctor);
router.patch("/:doctorId", doctorController.updateDoctor);
router.delete("/:doctorId", doctorController.deleteDoctor);
router.get("/:doctorId", doctorController.getDoctorById);
router.post("/ai-suggestion", doctorController.getAISuggestion);

export const doctorRoutes = router;
