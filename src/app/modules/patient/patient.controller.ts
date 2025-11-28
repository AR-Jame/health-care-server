import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { patientService } from "./patient.service";

const getAllPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await patientService.getAllPatient();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor data fetched successfully",
    data: result,
  });
});

export const patientController = {
  getAllPatient,
};
