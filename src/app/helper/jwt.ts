import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { IJWTPayload } from "../types/common";

const generateToken = (payload: JwtPayload, secret: Secret, expiresIn: string) => {
    const token = jwt.sign(payload, secret,
        {
            expiresIn: expiresIn
        } as SignOptions
    )
    return token;
}

const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret)
}


export const jwtHelper = { generateToken, verifyToken }