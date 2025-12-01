import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { prescriptionService } from "./prescription.service";

const createPrescription = catchAsync(async (req: Request, res: Response) => {
  const result = await prescriptionService.createPrescription({
    user: req.user,
    payload: req.body,
  });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Prescription created successfully",
    data: result,
  });
});

export const prescriptionController = {
  createPrescription,
};
