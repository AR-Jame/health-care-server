import express from "express"
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { scheduleRoutes } from "../modules/schedule/schedule.route";
import { doctorSchedule } from "../modules/doctorSchedule/doctorSchedule.route";
import { specialtiesRoutes } from "../modules/specialties/specialties.route";
import { doctorRoutes } from "../modules/doctor/doctor.route";

const router = express.Router();



const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/schedule",
        route: scheduleRoutes
    },
    {
        path: "/doctor-schedule",
        route: doctorSchedule
    },
    {
        path: "/specialties",
        route: specialtiesRoutes
    },
    {
        path: "/doctor",
        route: doctorRoutes
    },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))


export default router;
