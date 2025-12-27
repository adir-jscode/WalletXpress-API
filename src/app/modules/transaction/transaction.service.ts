import { JwtPayload } from "jsonwebtoken";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";

const createTransaction = async (payload: Partial<ITransaction>) => {
  const transaction = await Transaction.create(payload);
  return transaction;
};

//View transaction history -> logged in user id
const getTransactionHistory = async (payload: JwtPayload) => {
  const userId = payload.id;
  const transactionHistory = await Transaction.find({ initiator: userId });
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
