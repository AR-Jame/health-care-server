import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtHelper } from "../../helper/jwt";
import config from "../../../config";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";
import sendEmail from "../../helper/emailSender";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcryptjs.compare(
    payload.password,
    user.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is incorrect.");
  }

  const jwtPayload = { email: user.email, role: user.role };
  const accessToken = jwtHelper.generateToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_REFRESH_EXPIRES as string
  );
  const refreshToken = jwtHelper.generateToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_REFRESH_EXPIRES as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedToken;

  try {
    decodedToken = jwt.verify(
      token,
      config.JWT_REFRESH_SECRET as string
    ) as JwtPayload;
  } catch (error) {
    throw new ApiError(500, "You are not authorized.");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedToken.email,
      status: UserStatus.ACTIVE,
    },
  });

  const jwtPayload = { email: userData.email, role: userData.role };
  const accessToken = jwtHelper.generateToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    "10hr"
  );

  return { accessToken, needPasswordChange: userData.needPasswordChange };
};

const changePassword = async ({ user, payload }: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const isPasswordCorrect = await bcryptjs.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isPasswordCorrect) {
    throw new ApiError(500, "Your password is incorrect.");
  }

  const newHashPassword = await bcryptjs.hash(payload.newPassword, 10);

  const updatedData = await prisma.user.update({
    where: { id: userData.id },
    data: {
      password: newHashPassword,
    },
  });

  return true;
};

const forgetPassword = async (payload: any) => {
  console.log(payload.email);
  const userData = await prisma.user.findUniqueOrThrow({
    where: { email: payload.email },
  });

  const jwtPayload = { email: userData.email, role: userData.role };

  const resetToken = jwtHelper.generateToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_RESET_EXPIRES as string
  );

  const resetPassLink =
    config.RESET_PASS_LINK + `?userId=${userData.id}&token=${resetToken}`;

  await sendEmail(
    userData.email,
    `<div>
      <h1>This is your password reset link </h1>
      <p>Please click on this button to reset the password. 
      <a href=${resetPassLink}>
        <button>Reset Password </button>
      </a>
    </div>`
  );
};

const resetPassword = async ({ token, payload }: any) => {
  const verifyToken = jwt.verify(
    token,
    config.JWT_REFRESH_SECRET as string
  ) as JwtPayload;

  const userData = await prisma.user.findUniqueOrThrow({
    where: { id: payload.id, email: verifyToken.email },
  });

  const hashedPassword = await bcryptjs.hash(payload.password, 10);

  await prisma.user.update({
    where: { id: userData.id },
    data: {
      password: hashedPassword,
    },
  });
  return true;
};

const getMe = async (user: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const { password, ...rest } = userData;

  return rest;
};

export const authService = {
  login,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
  getMe,
};
