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

export const doctorController = {
  getAllDoctor,
};
