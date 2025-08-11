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
import { ApprovalStatus, IsActive, Role } from "../user/user.interface";
import { TransactionServices } from "../transaction/transaction.service";
import { WalletStatus } from "./wallet.interface";
import mongoose from "mongoose";

const addMoney = async (
  phone: string,
  balance: number,
  decodedToken: JwtPayload
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const isUserExist = await User.findOne({ phone: phone, role: Role.USER });
    if (!isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "user not found");
    }
    const userWallet = await Wallet.findOne({ owner: isUserExist._id });
    if (!userWallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "user wallet not found");
    }
    if (userWallet?.status !== WalletStatus.ACTIVE) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `user wallet is ${userWallet?.status}`
      );
    }
    const wallet = await Wallet.findOneAndUpdate(
      { owner: isUserExist._id },
      { $inc: { balance: +balance } },
      { new: true, session }
    );
    const agentWallet = await Wallet.findOne({ owner: decodedToken.id });
    if (!agentWallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "wallet not found");
    }
    if (!agentWallet || agentWallet.status !== WalletStatus.ACTIVE) {
      throw new AppError(httpStatus.BAD_REQUEST, "agent wallet is not active");
    }
    if (agentWallet?.balance < balance) {
      throw new AppError(httpStatus.BAD_REQUEST, "insufficient balance");
    }
    const updateAgentWallet = await Wallet.findOneAndUpdate(
      { owner: decodedToken.id },
      { $inc: { balance: -balance } },
      { new: true, session }
    );

    const transaction = await Transaction.create(
      [
        {
          fromWallet: agentWallet._id,
          toWallet: wallet?._id,
          initiator: decodedToken.id,
          type: TransactionType.CASH_IN,
          amount: balance,
          status: TransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return { wallet, updateAgentWallet, transaction };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const withdrawMoney = async (
  phone: string,
  balance: number,
  decodedToken: JwtPayload
) => {
  //transaction rollback
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userWallet = await Wallet.findOne({ owner: decodedToken.id });
    if (!userWallet) {
      throw new AppError(400, "user wallet not found");
    }
    if (userWallet.status !== WalletStatus.ACTIVE) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `user wallet is ${userWallet.status}`
      );
    }
    if (userWallet.balance < balance) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient wallet balance");
    }

    const updateUserWallet = await Wallet.findOneAndUpdate(
      { owner: decodedToken.id },
      { $inc: { balance: -balance } },
      { new: true, session }
    );

    const agent = await User.findOne({
      phone: phone,
      role: Role.AGENT,
      isActive: IsActive.ACTIVE,
      isVerified: true,
      isDeleted: false,
    });
    if (!agent) {
      throw new AppError(400, "Agent not found");
    }

    const updateAgent = await Wallet.findOneAndUpdate(
      { owner: agent.id },
      { $inc: { balance: +balance } },
      { new: true, session }
    );

    const transaction = await Transaction.create(
      [
        {
          fromWallet: userWallet._id,
          toWallet: agent.wallet,
          initiator: decodedToken.id,
          type: TransactionType.CASH_OUT,
          amount: balance,
          status: TransactionStatus.COMPLETED,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return { updateAgent, updateUserWallet, transaction };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const sendMoneyToUser = async (
  phone: string,
  amount: number,
  decodedToken: JwtPayload
) => {
  //transaction rollback
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findOne({
      phone,
      role: Role.USER,
      isDeleted: false,
      isVerified: true,
      isActive: IsActive.ACTIVE,
      approvalStatus: ApprovalStatus.APPROVED,
    });
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid phone number");
    }

    if (user._id === decodedToken.id) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You are not allowed to add money"
      );
    }

    const decodedUserWallet = await Wallet.findOneAndUpdate(
      {
        owner: decodedToken.id,
        status: WalletStatus.ACTIVE,
      },
      { $inc: { balance: -amount } },
      { new: true, session }
    );
    if (!decodedUserWallet) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "your wallet not found or inactive"
      );
    }

    const userWallet = await Wallet.findOneAndUpdate(
      { _id: user.wallet, status: WalletStatus.ACTIVE },
      { $inc: { balance: +amount } },
      { new: true, session }
    );
    if (!userWallet) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `User Wallet not found or inactive`
      );
    }
    const transaction = await Transaction.create({
      fromWallet: decodedUserWallet?._id,
      toWallet: userWallet._id,
      initiator: decodedToken.id,
      type: TransactionType.SEND,
      status: TransactionStatus.COMPLETED,
      amount: amount,
    });
    await session.commitTransaction();
    session.endSession();
    return { userWallet, transaction };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getWallets = async () => {
  const wallets = await Wallet.find({});
  return wallets;
};

export const WalletServices = {
  addMoney,
  withdrawMoney,
  sendMoneyToUser,
  getWallets,
};
