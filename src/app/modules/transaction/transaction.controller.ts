import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TransactionServices } from "./transaction.service";

const getTransactionHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const transactions = await TransactionServices.getTransactionHistory(
      req.user
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All transaction retrived",
      data: transactions,
    });
  }
);

const getAllTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const transactions = await TransactionServices.getAllTransaction();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All transaction retrived",
      data: transactions,
    });
  }
);

export const TransactionControllers = {
  getTransactionHistory,
  getAllTransaction,
};
