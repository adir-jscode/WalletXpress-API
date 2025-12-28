import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";

const createTransaction = async (payload: Partial<ITransaction>) => {
  const transaction = await Transaction.create(payload);
  return transaction;
};

//View transaction history -> logged in user id
const getTransactionHistory = async (payload: JwtPayload) => {
  const userId = payload.id;
  //find walletId from user
  const walletId = await User.findById(userId).select("wallet");
  if (!walletId) {
    throw new Error("Wallet not found for the user");
  }
  const transactionHistory = await Transaction.find({
    $or: [{ initiator: userId }, { type: "CASH_IN" }],
  }).populate("initiator");
  //sort by createdAt descending
  transactionHistory.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
  return transactionHistory;
};

const getAllTransaction = async () => {
  const transactions = await Transaction.find({}).populate("initiator");
  return transactions;
};
export const TransactionServices = {
  createTransaction,
  getTransactionHistory,
  getAllTransaction,
};
