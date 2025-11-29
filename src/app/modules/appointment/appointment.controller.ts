import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { appointmentService } from "./appointment.service";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  console.log(req.user);
  const result = await appointmentService.createAppointment();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor data fetched successfully",
    data: result,
  });
});

export const appointmentController = {
  createAppointment,
};
