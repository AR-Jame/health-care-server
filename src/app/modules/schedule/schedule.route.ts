import { Router } from "express";
import { scheduleController } from "./schedule.controller";

const router = Router();

router.post("/",
    scheduleController.createSchedule
)

router.get("/",
    scheduleController.scheduleForDoctor
)

router.delete("/:id",
    scheduleController.deleteSchedule
)

export const scheduleRoutes = router;