import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Wallet } from "./wallet.model";
import { Transaction } from "../transaction/transaction.model";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";

const addMoney = async (
  phone: string,
  balance: number,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findOne({ phone: phone });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "user not found");
  }
  const wallet = await Wallet.findOneAndUpdate(
    { owner: isUserExist._id },
    { $inc: { balance: +balance } },
    { new: true }
  );
  if (!wallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "wallet not found");
  }
  const agentWallet = await Wallet.findOne({ owner: decodedToken.id });
  if (!agentWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "wallet not found");
  }
  if (agentWallet?.balance < balance) {
    throw new AppError(httpStatus.BAD_REQUEST, "inssufficient balance");
  }
  const updateAgentWallet = await Wallet.findOneAndUpdate(
    { owner: decodedToken.id },
    { $inc: { balance: -balance } },
    { new: true }
  );

  const transaction = await Transaction.create({
    fromWallet: agentWallet._id,
    toWallet: wallet._id,
    initiator: decodedToken.id,
    type: TransactionType.ADD,
    amount: balance,
    status: TransactionStatus.COMPLETED,
  });

  return { wallet, updateAgentWallet, transaction };
};
const withdrawMoney = async (
  phone: string,
  balance: number,
  decodedToken: JwtPayload
) => {
  const userWallet = await Wallet.findOne({ owner: decodedToken.id });
  if (!userWallet) {
    throw new AppError(400, "user wallet not found");
  }
  if (userWallet.balance < balance) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient wallet balance");
  }

  const updateUserWallet = await Wallet.findOneAndUpdate(
    { owner: decodedToken.id },
    { $inc: { balance: -balance } },
    { new: true }
  );

  const agent = await User.findOne({ phone: phone, role: Role.AGENT });
  if (!agent) {
    throw new AppError(400, "Agent not found");
  }

  const updateAgent = await Wallet.findOneAndUpdate(
    { owner: agent.id },
    { $inc: { balance: +balance } },
    { new: true }
  );

  const transaction = await Transaction.create({
    fromWallet: userWallet._id,
    toWallet: agent.wallet,
    initiator: decodedToken.id,
    type: TransactionType.WITHDRAW,
    amount: balance,
    status: TransactionStatus.COMPLETED,
  });
  return { updateAgent, updateUserWallet, transaction };
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
