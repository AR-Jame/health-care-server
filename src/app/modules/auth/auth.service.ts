import { UserStatus } from "@prisma/client"
import { prisma } from "../../shared/prisma"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import { jwtHelper } from "../../helper/jwt";
import config from "../../../config";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";

const login = async (payload: { email: string, password: string }) => {

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const isCorrectPassword = await bcryptjs.compare(payload.password, user.password);

    if (!isCorrectPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Password is incorrect.")
    }

    const jwtPayload = { email: user.email, role: user.role }
    const accessToken = jwtHelper.generateToken(jwtPayload, config.JWT_ACCESS_SECRET as string, "1hr")
    const refreshToken = jwtHelper.generateToken(jwtPayload, config.JWT_REFRESH_SECRET as string, "90d")

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange
    }

}

export const authService = {
    login
}