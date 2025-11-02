import { Router } from "express";
import { scheduleController } from "./schedule.controller";

const router = Router();

router.post("/", 
    scheduleController.createSchedule
)

export const scheduleRoutes = router;