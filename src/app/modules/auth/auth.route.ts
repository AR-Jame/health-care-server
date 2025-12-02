import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/login", authController.login);

router.post("/refresh-token", authController.refreshToken);

router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.PATENT, UserRole.DOCTOR),
  authController.changePassword
);

router.post("/forget-password", authController.forgetPassword);

router.post("/reset-password", authController.resetPassword);

export const authRoutes = router;
