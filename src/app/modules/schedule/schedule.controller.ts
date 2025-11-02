import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse"
import { scheduleService } from "./schedule.service"
import pick from "../../helper/pick"

const createSchedule = catchAsync(async (req: Request, res: Response) => {
    const schedules = await scheduleService.createSchedule(req.body)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule created successfully",
        data: schedules
    })
})


const scheduleForDoctor = catchAsync(async (req: Request, res: Response) => {

    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])

    const filters = pick(req.query, ["startDateTime", "endDateTime"])

    const schedules = await scheduleService.scheduleForDoctor(options, filters)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedules retrieved successfully",
        data: schedules
    })
})

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
    const schedules = await scheduleService.deleteSchedule(req.params.id)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule deleted successfully",
        data: schedules
    })
})

export const scheduleController = {
    createSchedule,
    scheduleForDoctor,
    deleteSchedule
}