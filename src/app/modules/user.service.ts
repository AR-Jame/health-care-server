import { prisma } from "../shared/prisma";
import { createPatientInput } from "./user.interface";
import bcryptjs from "bcryptjs"

const createPatient = async (payload: createPatientInput) => {

    const hashedPassword = await bcryptjs.hash(payload.password, 10)

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.email,
                password: hashedPassword,
            }
        });
        return await tnx.patient.create({
            data: {
                name: payload.name,
                email: payload.email
            }
        })
    })

    return result

}

export const userService = {
    createPatient
} 