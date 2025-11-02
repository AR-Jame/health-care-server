import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";

type IPayload = {
    scheduleIds: string[]
}

const createDoctorSchedule = async (payload: IPayload, user: JwtPayload) => {

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        },
        select: {
            id: true
        }
    });

    const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
        doctorId: doctorData.id,
        scheduleId
    }));

    return await prisma.doctorSchedule.createMany({
        data: doctorScheduleData
    })

}

const getDoctorSchedule = async (user: JwtPayload) => {

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        },
        select: {
            id: true
        }
    })

    const result = await prisma.doctorSchedule.findMany({
        where: {
            doctorId: doctorData.id
        }
    })

    console.log(result);
    return result
}

export const doctorScheduleService = {
    createDoctorSchedule,
    getDoctorSchedule
}