import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthServices.credentialsLogin(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Logged in successfully",
      data: user,
    });
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.headers.authorization;
    console.log(refreshToken);
    const token = await AuthServices.getNewAccessToken(refreshToken as string);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "new access token generated",
      data: token,
    });
  }
);

export const AuthControllers = { credentialsLogin, getNewAccessToken };
