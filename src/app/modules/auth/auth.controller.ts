import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { setAuthCookie } from "../../utils/setCookie";
import AppError from "../../errorHelpers/AppError";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

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

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged Out Successfully",
      data: null,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await AuthServices.changePassword(
      req.user,
      req.body.oldPassword,
      req.body.newPassword
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);

const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await AuthServices.forgetPassword(email);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reset password URL sent Successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.query.id;
    const resetToken = req.query.token;
    const newPassword = req.body.newPassword;
    const payload = {
      id: userId,
      password: newPassword,
    };
    const decodedToken = await verifyToken(
      resetToken as string,
      envVars.JWT_ACCESS_SECRET
    );
    await AuthServices.resetPassword(payload, decodedToken as JwtPayload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password reset Successfully",
      data: null,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  changePassword,
  forgetPassword,
  resetPassword,
};
