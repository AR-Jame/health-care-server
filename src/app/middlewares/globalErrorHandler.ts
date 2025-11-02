import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            message = "Duplicate key error";
            error = err.meta
        }
        if (err.code === "P2003") {
            message = "Foreign";
            error = err.meta
        }
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        message = "Validation error";
        error = err.message
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        message = "Prisma client failed to initialized."
    }

    res.status(statusCode).json({
        success,
        message,
        error
    })
};

export default globalErrorHandler;