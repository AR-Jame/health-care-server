import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { fileUpload } from "../../helper/fileUploader";
import { userValidation } from "./user.validation";

const router = express.Router();

router.post(
    "/create-patient",
    fileUpload.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))
        next()
    },
    userController.createPatient
);

router.get("/", userController.getAllUser)

export const userRoutes = router;