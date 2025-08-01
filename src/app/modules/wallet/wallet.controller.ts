import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { WalletServices } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
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

export const WalletControllers = { addMoney, withdrawMoney };
