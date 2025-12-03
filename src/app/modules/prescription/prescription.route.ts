import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { prescriptionController } from "./prescription.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  prescriptionController.createPrescription
);

router.get(
  "/",
  auth(UserRole.PATENT),
  prescriptionController.getPatientPrescription
);

export const prescriptionRoutes = router;
