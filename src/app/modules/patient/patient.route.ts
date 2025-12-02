import { Router } from "express";
import { patientController } from "./patient.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", patientController.getAllPatient);
router.delete("/:patientId", patientController.deletePatient);
router.get("/:patientId", patientController.getPatientById);
router.patch(
  "/",
  auth(UserRole.PATENT),
  patientController.updatePatient
);

export const patientRoutes = router;
