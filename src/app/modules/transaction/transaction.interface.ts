import { Types } from "mongoose";

export enum TransactionType {
  ADD = "ADD",
  WITHDRAW = "WITHDRAW",
  SEND = "SEND",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
}
export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REVERSED = "REVERSED",
}
export interface ITransaction {
  fromWallet: Types.ObjectId;
  toWallet: Types.ObjectId;
  initiator: Types.ObjectId;
  type: TransactionType;
  amount: number;
  fee: number;
  comission: number;
  status: TransactionStatus;
}
