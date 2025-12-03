import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { prescriptionService } from "./prescription.service";
import pick from "../../helper/pick";

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

const getPatientPrescription = catchAsync(
  async (req: Request, res: Response) => {
    const option = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await prescriptionService.getPatientPrescription({
      user: req.user,
      option,
    });
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Prescription retrieved successfully",
      data: result,
    });
  }
);

export const prescriptionController = {
  createPrescription,
  getPatientPrescription,
};
