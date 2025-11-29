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

export const appointmentRoutes = router;
