import { Types } from "mongoose";

export enum NotificationType {
  CASH_IN = "CASH_IN",       // user received money from agent (addMoney)
  CASH_OUT = "CASH_OUT",     // user withdrew money via agent
  MONEY_SENT = "MONEY_SENT", // sender: you sent money
  MONEY_RECEIVED = "MONEY_RECEIVED", // receiver: you got money
}

export interface INotification {
  _id?: Types.ObjectId;
  recipient: Types.ObjectId;   // the user who receives this notification
  type: NotificationType;
  title: string;
  message: string;
  amount: number;
  isRead: boolean;
  transactionId?: Types.ObjectId;
  createdAt?: Date;
}
