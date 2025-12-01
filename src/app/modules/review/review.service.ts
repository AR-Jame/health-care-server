import ApiError from "../../error/ApiError";
import { prisma } from "../../shared/prisma";

const createReview = async ({ user, payload }: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: { email: user.email },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: { id: payload.appointmentId },
  });

  if (patientData.id !== appointmentData.patientId) {
    throw new ApiError(500, "This is not your appointment");
  }

  return await prisma.$transaction(async (tnx) => {
    const result = await tnx.review.create({
      data: {
        appointmentId: payload.appointmentId,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        rating: Number(payload.rating),
        comment: payload.comment,
      },
    });
    const avgCount = await tnx.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        doctorId: appointmentData.doctorId,
      },
    });

    await tnx.doctor.update({
      where: { id: appointmentData.doctorId },
      data: {
        averageRating: avgCount._avg.rating as number,
      },
    });

    return result;
  });
};

export const reviewService = {
  createReview,
};
