import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();

router.get("/", doctorController.getAllDoctor);
router.patch("/:doctorId", doctorController.updateDoctor)


export const doctorRoutes = router; 