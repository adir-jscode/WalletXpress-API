import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Wallet } from "./wallet.model";
import { Transaction } from "../transaction/transaction.model";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";
import { TransactionServices } from "../transaction/transaction.service";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { WalletStatus } from "./wallet.interface";

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

const sendMoneyToUser = async (
  phone: string,
  amount: number,
  decodedToken: JwtPayload
) => {
  const user = await User.findOne({ phone });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid phone number");
  }

  //handle this error
  if (user._id === decodedToken.id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not allowed to add money"
    );
  }

  const decodedUserWallet = await Wallet.findOne({ owner: decodedToken.id });
  if (!decodedUserWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "your wallet not found");
  }

  const userWallet = await Wallet.findByIdAndUpdate(
    user.wallet,
    { $inc: { balance: +amount } },
    { new: true }
  );
  if (!userWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Wallet not found");
  }
  const transaction = await Transaction.create({
    fromWallet: decodedUserWallet?._id,
    toWallet: userWallet._id,
    initiator: decodedToken.id,
    type: TransactionType.SEND,
    status: TransactionStatus.COMPLETED,
    amount: amount,
  });
  return { userWallet, transaction };
};

const cashIn = async (
  phone: string,
  amount: number,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findOne({ phone: phone });
  console.log(isUserExist);
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  //update user wallet
  const userWallet = await Wallet.findOneAndUpdate(
    { owner: isUserExist._id },
    { $inc: { balance: +amount } },
    { new: true, runValidators: true }
  );

  //update agent wallet
  const agentWallet = await Wallet.findOneAndUpdate(
    { owner: decodedToken._id },
    { $inc: { balance: -amount } },
    { new: true, runValidators: true }
  );

  const agentWalletId = decodedToken.walletId;
  //create new transaction
  const transaction = await Transaction.create({
    fromWallet: agentWalletId,
    toWallet: isUserExist._id,
    initiator: decodedToken.id,
    amount: amount,
    type: TransactionType.CASH_IN,
    status: TransactionStatus.COMPLETED,
  });

  return { userWallet, agentWallet, transaction };
};

const getWallets = async () => {
  const wallets = await Wallet.find({});
  return wallets;
};

export const WalletServices = {
  addMoney,
  withdrawMoney,
  sendMoneyToUser,
  cashIn,
  getWallets,
};
