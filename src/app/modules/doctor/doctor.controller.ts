import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorServices } from "./doctor.service";
import pick from "../../helper/pick";
import { doctorFilterableFields } from "./doctor.constant";

const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, doctorFilterableFields);

  const result = await doctorServices.getAllDoctor(options, filters);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor data fetched successfully",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const result = await doctorServices.updateDoctor(
    doctorId as string,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor data updated fetched successfully",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const result = await doctorServices.deleteDoctor(doctorId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor data deleted successfully",
    data: result,
  });
});
const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const result = await doctorServices.getDoctorById(doctorId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor data fetched successfully",
    data: result,
  });
});

export const doctorController = {
  getAllDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
};
