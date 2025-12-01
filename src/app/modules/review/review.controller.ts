import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const { user, body } = req;
  const result = await reviewService.createReview({ user, payload: body });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Appointment created successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
};
