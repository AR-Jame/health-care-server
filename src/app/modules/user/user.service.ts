import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { createPatientInput } from "./user.interface";
import bcryptjs from "bcryptjs"
import { fileUpload } from "../../helper/fileUploader";
import { UploadApiResponse } from "cloudinary";

const createPatient = async (req: Request) => {

    let uploadResult: UploadApiResponse | void;

    if (req.file) {
        uploadResult = await fileUpload.uploadToCloudinary(req.file);
    }

    const hashedPassword = await bcryptjs.hash(req.body.password, 10)

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: req.body.email,
                password: hashedPassword,
            }
        });
        return await tnx.patient.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                profilePhoto: uploadResult?.secure_url
            }
        })
    })

    return result

}

export const userService = {
    createPatient
} 