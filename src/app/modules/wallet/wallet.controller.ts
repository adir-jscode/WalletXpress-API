import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { WalletServices } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { envVars } from "../../config/env";

const addMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const addMoney = await WalletServices.addMoney(
      req.body.phone,
      req.body.balance,
      req.user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `$ ${req.body.balance} Top up successful`,
      data: addMoney,
    });
  }
);

const withdrawMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const withdrawMoney = await WalletServices.withdrawMoney(
      req.body.phone,
      req.body.balance,
      req.user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `$ ${req.body.balance} withdrawn successfully`,
      data: withdrawMoney,
    });
  }
);

const sendMoneyToUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone, amount } = req.body;
    const verifyToken = req.user;
    const sendMoney = await WalletServices.sendMoneyToUser(
      phone,
      amount,
      verifyToken
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `$ ${amount} sent successfully`,
      data: sendMoney,
    });
  }
);

const getWallets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const wallets = await WalletServices.getWallets();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All wallet retrived successfully",
      data: wallets,
    });
  }
);

export const WalletControllers = {
  addMoney,
  withdrawMoney,
  sendMoneyToUser,
  getWallets,
};
