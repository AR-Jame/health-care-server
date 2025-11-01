import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import { userFilterableFields, userSearchableFields } from "./user.constant";

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const patient = await userService.createPatient(req)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: patient
    })
})

const createDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createDoctor(req);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor created successfully",
        data: result
    })
})

const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createAdmin(req);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin created successfully",
        data: result
    })
})

const getAllUser = catchAsync(async (req: Request, res: Response) => {

    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])

    const filters = pick(req.query, userFilterableFields)

    const result = await userService.getAllUser(filters, options)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully",
        data: result
    })
})


export const userController = {
    createPatient,
    createDoctor,
    createAdmin,
    getAllUser
}