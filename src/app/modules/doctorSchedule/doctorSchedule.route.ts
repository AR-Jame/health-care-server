import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { doctorScheduleController } from "./doctorSchedule.controller";
import validateRequest from "../../middlewares/validateRequest";
import { doctorScheduleValidation } from "./doctorSchedule.validation";

const router = Router();


router.post("/",
    auth(UserRole.DOCTOR),
    validateRequest(doctorScheduleValidation.createDoctorScheduleValidationSchema),
    doctorScheduleController.createDoctorSchedule
)

router.get("/",
    auth(UserRole.DOCTOR),
    doctorScheduleController.getDoctorSchedule
)

export const doctorSchedule = router;