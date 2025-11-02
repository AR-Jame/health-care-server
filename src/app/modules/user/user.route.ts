import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { fileUpload } from "../../helper/fileUploader";
import { userValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
    "/create-patient",
    fileUpload.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createPatientValidationSchema.parse(JSON.parse(req.body?.data))
        next()
    },
    userController.createPatient
);

router.post(
    "/create-doctor",
        auth(UserRole.ADMIN),
    fileUpload.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createDoctorValidationSchema.parse(JSON.parse(req.body.data))
        next()
    },
    userController.createDoctor
)

router.post(
    "/create-admin",
    auth(UserRole.ADMIN),
    fileUpload.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))
        next()
    },
    userController.createAdmin
)

router.get("/",
    auth(UserRole.ADMIN),
    userController.getAllUser
)

export const userRoutes = router;