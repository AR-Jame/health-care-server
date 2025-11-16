import { NextFunction, Request, Response, Router } from "express";
import { fileUpload } from "../../helper/fileUploader";
import { specialtyValidation } from "./specialties.validation";
import { specialtiesController } from "./specialties.controller";

const router = Router();

router.post(
  "/",
  fileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialtyValidation.createSpecialtyValidationSchema.parse(
      JSON.parse(req.body?.data)
    );
    next();
  },
  specialtiesController.createSpecialty
);

router.get("/", specialtiesController.getAllSpecialty);

router.delete("/", specialtiesController.deleteSpecialty);

export const specialtiesRoutes = router;
