import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const patient = await userService.createPatient(req)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: patient
    })
})


export const userController = { createPatient }