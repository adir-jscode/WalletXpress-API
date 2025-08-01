import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Wallet } from "./wallet.model";
const addMoney = async (userId: string, amount: number) => {
  const wallet = await Wallet.findOneAndUpdate(
    { owner: userId },
    { $inc: { balance: amount } },
    { new: true }
  );

  if (!wallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found");
  }

  return wallet;
};
const withdrawMoney = async (userId: string, amount: number) => {
  if (amount < 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Withdraw amount must be positive"
    );
  }
  const wallet = await Wallet.findOneAndUpdate(
    { owner: userId, balance: { $gte: amount } },
    { $inc: { balance: -amount } },
    { new: true }
  );

  if (!wallet) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Wallet not found or insufficient balance"
    );
  }
  return wallet;
};

export const WalletServices = { addMoney, withdrawMoney };
