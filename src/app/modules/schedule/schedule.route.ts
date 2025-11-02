import { Router } from "express";
import { scheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/",
    scheduleController.createSchedule
)

router.get("/",
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    scheduleController.scheduleForDoctor
)

router.delete("/:id",
    scheduleController.deleteSchedule
)

export const scheduleRoutes = router;