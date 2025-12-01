import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", auth(UserRole.PATENT), reviewController.createReview);

export const reviewRoutes = router;
