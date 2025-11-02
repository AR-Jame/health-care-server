import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse"
import { doctorScheduleService } from "./doctorSchedule.service"

const createDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const schedules = await doctorScheduleService.createDoctorSchedule(req.body, req.user)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Schedule created successfully",
        data: schedules
    })
})

const getDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const schedules = await doctorScheduleService.getDoctorSchedule(req.user)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor Schedule retrieved successfully",
        data: schedules
    })
})


export const doctorScheduleController = {
    createDoctorSchedule,
    getDoctorSchedule
}