import { UserStatus } from "@prisma/client"
import { prisma } from "../../shared/prisma"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import { jwtHelper } from "../../helper/jwt";

const login = async (payload: { email: string, password: string }) => {

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const isCorrectPassword = await bcryptjs.compare(payload.password, user.password);

    if (!isCorrectPassword) {
        throw new Error("Password is incorrect.")
    }

    const jwtPayload = { email: user.email, role: user.role }
    const accessToken = jwtHelper.generateToken(jwtPayload, "jdfkadjfl;d", "1hr")
    const refreshToken = jwtHelper.generateToken(jwtPayload, "jdfkadjffdfdafl;d", "90d")

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange
    }

}

export const authService = {
    login
}