import { model, Schema } from "mongoose";
import { INotification, NotificationType } from "./notification.interface";

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    amount: { type: Number, required: true },
    isRead: { type: Boolean, default: false },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  },
  { timestamps: true, versionKey: false }
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
