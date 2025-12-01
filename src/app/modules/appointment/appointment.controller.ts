import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { appointmentService } from "./appointment.service";
import pick from "../../helper/pick";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const { user, body } = req;
  const result = await appointmentService.createAppointment({ user, body });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Appointment created successfully",
    data: result,
  });
});

const getAppointments = catchAsync(async (req: Request, res: Response) => {
  const { user, query } = req;

  const filters = pick(query, ["status", "paymentStatus"]);
  const options = pick(query, ["limit", "page", "sortOrder", "sortBy"]);

  const result = await appointmentService.getAppointments({
    user,
    filters,
    options,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "appointment data fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateAppointmentStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { user, body, params } = req;
    const result = await appointmentService.updateAppointmentStatus({
      appointmentId: params.id,
      status: body.status,
      user,
    });
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Appointment created successfully",
      data: result,
    });
  }
);

export const appointmentController = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
};
