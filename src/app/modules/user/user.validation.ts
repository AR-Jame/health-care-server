import { Gender } from "@prisma/client";
import z from "zod";

const createPatientValidationSchema = z.object({
    password: z.string(),
    name: z.string({ error: "Name is required" }),
    email: z.string({
        error: "Email is required"
    }),
    address: z.string().optional(),
})

const createDoctorValidationSchema = z.object({
    name: z.string({
        error: "Name is required!"
    }),
    email: z.string({
        error: "Email is required!"
    }),
    password: z.string({
        error: "Password is required."
    }),
    contactNumber: z.string({
        error: "Contact Number is required!"
    }),
    address: z.string({
        error: "Address is required"
    }),
    registrationNumber: z.string({
        error: "Reg number is required"
    }),
    experience: z.number().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    appointmentFee: z.number({
        error: "appointment fee is required"
    }),
    qualification: z.string({
        error: "qualification is required"
    }),
    currentWorkingPlace: z.string({
        error: "Current working place is required!"
    }),
    designation: z.string({
        error: "Designation is required!"
    })
})

export const userValidation = {
    createPatientValidationSchema,
    createDoctorValidationSchema
}