import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionServices } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";

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

export const TransactionControllers = { getTransactionHistory };
