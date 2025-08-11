import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OtpServices } from "./otp.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const sendOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name } = req.body;
    await OtpServices.sendOtp(email, name);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP sent successfully",
      data: null,
    });
  }
);
const verifyOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    await OtpServices.verifyOtp(email, otp);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User verification is completed",
      data: null,
    });
  }
);

export const OtpControllers = { sendOtp, verifyOtp };
