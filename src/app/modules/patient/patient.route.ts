import { Router } from "express";
import { patientController } from "./patient.controller";

const router = Router();

router.get("/", patientController.getAllPatient);
router.delete("/:patientId", patientController.deletePatient);
router.get("/:patientId", patientController.getPatientById);
router.patch("/:patientId", patientController.updatePatient);

export const patientRoutes = router;
