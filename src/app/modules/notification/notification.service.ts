import { Types } from "mongoose";
import { emitToUser } from "../../socket/socketManager";
import { INotification, NotificationType } from "./notification.interface";
import { Notification } from "./notification.model";

// ─── Core helper ─────────────────────────────────────────────────────────────

/**
 * Persist a notification to MongoDB and immediately push it
 * to the recipient's socket (if they are connected).
 */
export const createAndEmitNotification = async (
  data: Omit<INotification, "isRead">
): Promise<void> => {
  const notification = await Notification.create({ ...data, isRead: false });

  // Push to socket in real-time
  emitToUser(data.recipient.toString(), "notification:new", {
    _id: notification._id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    amount: notification.amount,
    isRead: false,
    transactionId: notification.transactionId,
    createdAt: notification.createdAt,
  });
};

// ─── Transaction-specific helpers ────────────────────────────────────────────

/** Called after addMoney (CASH_IN) — notify the user who received cash */
export const notifyCashIn = async (
  recipientUserId: Types.ObjectId,
  amount: number,
  transactionId: Types.ObjectId
) => {
  await createAndEmitNotification({
    recipient: recipientUserId,
    type: NotificationType.CASH_IN,
    title: "Cash In Successful",
    message: `৳${amount} has been added to your wallet by an agent.`,
    amount,
    transactionId,
  });
};

/** Called after withdrawMoney (CASH_OUT) — notify the user who withdrew */
export const notifyCashOut = async (
  recipientUserId: Types.ObjectId,
  amount: number,
  transactionId: Types.ObjectId
) => {
  await createAndEmitNotification({
    recipient: recipientUserId,
    type: NotificationType.CASH_OUT,
    title: "Cash Out Successful",
    message: `৳${amount} has been withdrawn from your wallet via an agent.`,
    amount,
    transactionId,
  });
};

/** Called after sendMoneyToUser — notify both sender and receiver */
export const notifySendMoney = async (
  senderUserId: Types.ObjectId,
  receiverUserId: Types.ObjectId,
  amount: number,
  transactionId: Types.ObjectId
) => {
  await Promise.all([
    // Sender notification
    createAndEmitNotification({
      recipient: senderUserId,
      type: NotificationType.MONEY_SENT,
      title: "Money Sent",
      message: `৳${amount} has been sent from your wallet successfully.`,
      amount,
      transactionId,
    }),
    // Receiver notification
    createAndEmitNotification({
      recipient: receiverUserId,
      type: NotificationType.MONEY_RECEIVED,
      title: "Money Received",
      message: `৳${amount} has been received in your wallet.`,
      amount,
      transactionId,
    }),
  ]);
};

// ─── REST service methods ─────────────────────────────────────────────────────

/** Get all notifications for a user (latest first) */
const getMyNotifications = async (userId: string) => {
  return Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
};

/** Count unread notifications for a user */
const getUnreadCount = async (userId: string) => {
  return Notification.countDocuments({ recipient: userId, isRead: false });
};

/** Mark a single notification as read */
const markAsRead = async (notificationId: string, userId: string) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  );
};

/** Mark ALL notifications of a user as read */
const markAllAsRead = async (userId: string) => {
  return Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true }
  );
};

/** Delete a single notification */
const deleteNotification = async (notificationId: string, userId: string) => {
  return Notification.findOneAndDelete({
    _id: notificationId,
    recipient: userId,
  });
};

export const NotificationServices = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
