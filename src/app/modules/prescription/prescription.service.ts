import { AppointmentStatus, PaymentStatus, UserRole } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import ApiError from "../../error/ApiError";
import { calculatePagination } from "../../helper/paginationHelper";

const createPrescription = async ({ user, payload }: any) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });

  if (user.role === UserRole.PATENT) {
    if (user.role !== appointmentData.doctor.email) {
      throw new ApiError(500, "It's not your appointment");
    }
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions,
      followupDates: payload.followupDates || null,
    },
  });

  return result;
};

const getPatientPrescription = async ({ user, option }: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(option);

  const prescription = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user.email,
      },
    },
    // include: {
    //   doctor: true,
    //   appointment: true,
    // },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user.email,
      },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: prescription,
  };
};

export const prescriptionService = {
  createPrescription,
  getPatientPrescription,
};
