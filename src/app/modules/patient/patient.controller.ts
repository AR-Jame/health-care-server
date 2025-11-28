import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { patientService } from "./patient.service";
import pick from "../../helper/pick";

const getAllPatient = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["searchTerm", "email", "name"]);

  const result = await patientService.getAllPatient({ options, filters });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor data fetched successfully",
    data: result?.data,
    meta: result?.meta,
  });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const { patientId } = req.params;
  const result = await patientService.deletePatient(patientId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient data deleted successfully",
    data: result,
  });
});

const getPatientById = catchAsync(async (req: Request, res: Response) => {
  const { patientId } = req.params;
  const result = await patientService.getPatientById(patientId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient data fetched successfully",
    data: result,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const { patientId } = req.params;

  const result = await patientService.updatePatient(
    patientId as string,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient data updated successfully",
    data: result,
  });
});

export const patientController = {
  getAllPatient,
  deletePatient,
  getPatientById,
  updatePatient,
};
