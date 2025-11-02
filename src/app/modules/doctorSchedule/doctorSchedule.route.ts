import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { doctorScheduleController } from "./doctorSchedule.controller";

const router = Router();


router.post("/",
    auth(UserRole.DOCTOR),
    doctorScheduleController.createDoctorSchedule
)

router.get("/",
    auth(UserRole.DOCTOR),
    doctorScheduleController.getDoctorSchedule
)

export const doctorSchedule = router;