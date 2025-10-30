import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const generateToken = (payload: JwtPayload, secret: Secret, expiresIn: string) => {
    const token = jwt.sign(payload, secret,
        {
            expiresIn: expiresIn
        } as SignOptions
    )
    return token;
}
export const jwtHelper = {generateToken}