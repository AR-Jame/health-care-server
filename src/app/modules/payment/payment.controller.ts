import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { paymentService } from "./payment.service";
import Stripe from "stripe";
import { stripe } from "../../helper/stripe";
import config from "../../../config";

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.log(`❌ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const result = await paymentService.stripeWebhook(event);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stripe webhook operation successful.",
    data: result,
  });
});

export const paymentController = {
  stripeWebhook,
};
