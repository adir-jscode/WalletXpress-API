import { model, Schema } from "mongoose";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    fromWallet: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    toWallet: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    initiator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    comission: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
