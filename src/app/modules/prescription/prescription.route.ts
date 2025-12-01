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

export const prescriptionRoutes = router;
