import { Router } from "express";
import { scheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/",
    auth(UserRole.ADMIN),
    scheduleController.createSchedule
)

router.get("/",
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    scheduleController.scheduleForDoctor
)

router.delete("/:id",
    auth(UserRole.ADMIN),
    scheduleController.deleteSchedule
)

export const scheduleRoutes = router;