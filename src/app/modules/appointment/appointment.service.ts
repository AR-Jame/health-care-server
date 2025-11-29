import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import crypto from "crypto";
const createAppointment = async ({
  user,
  body,
}: {
  user: JwtPayload;
  body: { doctorId: string; scheduleId: string };
}) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: { email: user.email },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: body.doctorId,
      isDeleted: false,
    },
  });

  const isBooked = await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: body.doctorId,
      scheduleId: body.scheduleId,
      isBooked: false,
    },
  });

  const videoCallId = crypto.randomUUID();
  const transactionId = crypto.randomUUID();

  const result = prisma.$transaction(async (tnx) => {
    await tnx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: isBooked.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    const appointmentData = await tnx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: isBooked.scheduleId,
        videoCallId,
      },
    });

    await tnx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    return appointmentData;;
  });

  return result;
};

export const appointmentService = {
  createAppointment,
};
