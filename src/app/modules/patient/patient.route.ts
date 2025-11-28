import { Router } from "express";
import { patientController } from "./patient.controller";

const router = Router();

router.get("/", patientController.getAllPatient);
