import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { setAuthCookie } from "../../utils/setCookie";
import AppError from "../../errorHelpers/AppError";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);
    setAuthCookie(res, loginInfo);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Logged in successfully",
      data: loginInfo,
    });
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token recieved from cookies"
      );
    }
    const accessToken = await AuthServices.getNewAccessToken(
      refreshToken as string
    );
    setAuthCookie(res, accessToken);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New Access token generated",
      data: accessToken,
    });
  }
);

export const AuthControllers = { credentialsLogin, getNewAccessToken };
