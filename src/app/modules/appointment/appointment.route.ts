import { Router } from "express";
import { appointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  auth(UserRole.PATENT),
  appointmentController.createAppointment
);

router.get(
  "/",
  auth(UserRole.PATENT, UserRole.DOCTOR),
  appointmentController.getAppointments
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  appointmentController.updateAppointmentStatus
);

export const appointmentRoutes = router;
