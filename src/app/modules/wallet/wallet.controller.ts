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
      req.params.id,
      req.body.amount
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `$ ${req.body.amount} Top up successful`,
      data: addMoney,
    });
  }
);

const withdrawMoney = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const withdrawMoney = await WalletServices.withdrawMoney(
      req.params.id,
      req.body.amount
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `$ ${req.body.amount} withdrawn successfully`,
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

const cashIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone, amount } = req.body;
    const cashIn = WalletServices.cashIn(phone, amount, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `$ ${amount} sent successfully`,
      data: cashIn,
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
  cashIn,
  getWallets,
};
