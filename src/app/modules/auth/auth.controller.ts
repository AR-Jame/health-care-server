import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { authService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  res.cookie("accessToken", result.accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });

  res.cookie("refreshToken", result.refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 90,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User logged successfully",
    data: result.needPasswordChange,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  const result = await authService.refreshToken(refreshToken);

  res.cookie("accessToken", result.accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Access token generated successfully.",
    data: result.needPasswordChange,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.changePassword({
    user: req.user,
    payload: req.body,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.forgetPassword(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "password reset email sent.",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const payload = req.body;

  const result = await authService.resetPassword({ token, payload });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

export const authController = {
  login,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
