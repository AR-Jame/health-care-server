import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import crypto from "crypto";
import { stripe } from "../../helper/stripe";
import { calculatePagination } from "../../helper/paginationHelper";
import {
  AppointmentStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import ApiError from "../../error/ApiError";

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

    const paymentData = await tnx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    /*     PAYMENT INIT   */
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Appointment with Dr. Firoz.",
            },
            unit_amount: doctorData.appointmentFee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointmentData.id,
        paymentId: paymentData.id,
      },
      success_url: `https://youtube.com?success=true`,
      cancel_url: "http://programming-hero.com?success=false",
    });

    return { paymentUrl: session.url };
  });

  return result;
};

const getAppointments = async ({ user, filters, options }: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const andCondition: Prisma.AppointmentWhereInput[] = [];

  if (user.role === UserRole.DOCTOR) {
    andCondition.push({
      doctor: {
        email: user.email,
      },
    });
  } else if (user.role === UserRole.PATENT) {
    andCondition.push({
      patient: {
        email: user.email,
      },
    });
  }

  if (Object.keys(filters).length > 0) {
    const filterCondition = Object.keys(filters).map((key) => ({
      [key]: {
        equals: filters[key],
      },
    }));

    andCondition.push(...filterCondition);
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    include:
      user.role === UserRole.DOCTOR ? { patient: true } : { doctor: true },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: skip,
    take: limit,
  });

  const total = await prisma.appointment.count({ where: whereConditions });

  return {
    data: result,
    meta: { page, limit, total },
  };
};

const updateAppointmentStatus = async ({
  appointmentId,
  status,
  user,
}: any) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: { id: appointmentId },
    include: { patient: true },
  });

  if (user.role === UserRole.PATENT) {
    if (user.role !== appointmentData.patient.email) {
      throw new ApiError(500, "It's not your appointment");
    }
  }

  const updateData = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: status,
    },
  });

  return updateData;
};

const cancelUnpaidAppointment = async () => {
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);

  const result = await prisma.appointment.findMany({
    where: {
      paymentStatus: PaymentStatus.UNPAID,
      createdAt: {
        lte: thirtyMinAgo,
      },
    },
    select: { id: true, doctorId: true, scheduleId: true },
  });

  const appointmentIds = result.map((appointment) => appointment.id);

  prisma.$transaction(async (tnx) => {
    await tnx.appointment.deleteMany({
      where: {
        id: {
          in: appointmentIds,
        },
      },
    });

    await tnx.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentIds,
        },
      },
    });

    for (const id of result) {
      await tnx.doctorSchedule.update({
        where: {
          doctorId_scheduleId: {
            scheduleId: id.scheduleId,
            doctorId: id.doctorId,
          },
        },
        data: {
          isBooked: false,
        },
      });
    }
  });

  return true;
};

export const appointmentService = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  cancelUnpaidAppointment,
};
