import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import crypto from "crypto";
import { stripe } from "../../helper/stripe";
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

export const appointmentService = {
  createAppointment,
};
