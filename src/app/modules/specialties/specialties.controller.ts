import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { specialtiesService } from "./specialties.service";

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesService.createSpecialties(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Specialties created successfully!",
    data: result,
  });
});

const getAllSpecialty = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesService.getAllSpecialty();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialties data fetched successfully",
    data: result,
  });
});

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialtiesService.deleteSpecialty(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialty deleted successfully",
    data: result,
  });
});

export const specialtiesController = {
  createSpecialty,
  getAllSpecialty,
  deleteSpecialty,
};
