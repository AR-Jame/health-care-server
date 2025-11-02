import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "../helper/jwt";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";

const auth = (...roles: string[]) => {
    
    return async (req: Request, res: Response, next: NextFunction) => {

        try {
            const token = req.cookies.accessToken;

            if (!token) {
                throw new Error("Token does not found. ")
            }

            const verifyUser = jwtHelper.verifyToken(token, config.JWT_ACCESS_SECRET as string);

            req.user = verifyUser;

            if (roles && !roles.includes(verifyUser?.role)) {
                throw new Error("You are not authorized!")
            }

            next();

        } catch (error) {
            next(error)
        }
    }
}
export default auth;