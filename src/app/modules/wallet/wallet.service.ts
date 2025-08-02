import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Wallet } from "./wallet.model";
import { Transaction } from "../transaction/transaction.model";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";
import { TransactionServices } from "../transaction/transaction.service";
const addMoney = async (walletId: string, amount: number) => {
  const wallet = await Wallet.findByIdAndUpdate(
    { _id: walletId },
    { $inc: { balance: amount } },
    { new: true }
  );

  if (!wallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found");
  }

  const transaction = await Transaction.create({
    fromWallet: wallet._id,
    toWallet: wallet._id,
    initiator: wallet.owner,
    type: TransactionType.ADD,
    amount: amount,
    status: TransactionStatus.COMPLETED,
  });

  return { wallet, transaction };
};
const withdrawMoney = async (walletId: string, amount: number) => {
  if (amount < 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Withdraw amount must be positive"
    );
  }
  const wallet = await Wallet.findOneAndUpdate(
    { _id: walletId, balance: { $gte: amount } },
    { $inc: { balance: -amount } },
    { new: true }
  );

  if (!wallet) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Wallet not found or insufficient balance"
    );
  }

  const transaction = await Transaction.create({
    fromWallet: wallet._id,
    toWallet: wallet._id,
    initiator: wallet.owner,
    type: TransactionType.WITHDRAW,
    amount: amount,
    status: TransactionStatus.COMPLETED,
  });
  return { wallet, transaction };
};

const sendMoneyToUser = async (walletId: string, amount: number) => {
  const userWallet = Wallet.findByIdAndUpdate(
    walletId,
    { $inc: { balance: amount } },
    { new: true }
  );
  if (!userWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Wallet not found");
  }
  //need logged in user id
};

export const WalletServices = { addMoney, withdrawMoney, sendMoneyToUser };
