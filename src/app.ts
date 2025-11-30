import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import { paymentRoutes } from "./app/modules/payment/payment.route";

const app: Application = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// Only to stripe payment

app.use("/api/v1/payment", paymentRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Server is running..",
    environment: config.node_env,
    uptime: process.uptime().toFixed(2) + " second.",
    time: new Date().toISOString(),
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
