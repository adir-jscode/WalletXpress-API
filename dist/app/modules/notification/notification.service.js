"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationServices = exports.notifySendMoney = exports.notifyCashOut = exports.notifyCashIn = exports.createAndEmitNotification = void 0;
const socketManager_1 = require("../../socket/socketManager");
const notification_interface_1 = require("./notification.interface");
const notification_model_1 = require("./notification.model");
// ─── Core helper ─────────────────────────────────────────────────────────────
/**
 * Persist a notification to MongoDB and immediately push it
 * to the recipient's socket (if they are connected).
 */
const createAndEmitNotification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield notification_model_1.Notification.create(Object.assign(Object.assign({}, data), { isRead: false }));
    // Push to socket in real-time
    (0, socketManager_1.emitToUser)(data.recipient.toString(), "notification:new", {
        _id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        amount: notification.amount,
        isRead: false,
        transactionId: notification.transactionId,
        createdAt: notification.createdAt,
    });
});
exports.createAndEmitNotification = createAndEmitNotification;
// ─── Transaction-specific helpers ────────────────────────────────────────────
/** Called after addMoney (CASH_IN) — notify the user who received cash */
const notifyCashIn = (recipientUserId, amount, transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.createAndEmitNotification)({
        recipient: recipientUserId,
        type: notification_interface_1.NotificationType.CASH_IN,
        title: "Cash In Successful",
        message: `৳${amount} has been added to your wallet by an agent.`,
        amount,
        transactionId,
    });
});
exports.notifyCashIn = notifyCashIn;
/** Called after withdrawMoney (CASH_OUT) — notify the user who withdrew */
const notifyCashOut = (recipientUserId, amount, transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.createAndEmitNotification)({
        recipient: recipientUserId,
        type: notification_interface_1.NotificationType.CASH_OUT,
        title: "Cash Out Successful",
        message: `৳${amount} has been withdrawn from your wallet via an agent.`,
        amount,
        transactionId,
    });
});
exports.notifyCashOut = notifyCashOut;
/** Called after sendMoneyToUser — notify both sender and receiver */
const notifySendMoney = (senderUserId, receiverUserId, amount, transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([
        // Sender notification
        (0, exports.createAndEmitNotification)({
            recipient: senderUserId,
            type: notification_interface_1.NotificationType.MONEY_SENT,
            title: "Money Sent",
            message: `৳${amount} has been sent from your wallet successfully.`,
            amount,
            transactionId,
        }),
        // Receiver notification
        (0, exports.createAndEmitNotification)({
            recipient: receiverUserId,
            type: notification_interface_1.NotificationType.MONEY_RECEIVED,
            title: "Money Received",
            message: `৳${amount} has been received in your wallet.`,
            amount,
            transactionId,
        }),
    ]);
});
exports.notifySendMoney = notifySendMoney;
// ─── REST service methods ─────────────────────────────────────────────────────
/** Get all notifications for a user (latest first) */
const getMyNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
});
/** Count unread notifications for a user */
const getUnreadCount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.countDocuments({ recipient: userId, isRead: false });
});
/** Mark a single notification as read */
const markAsRead = (notificationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.findOneAndUpdate({ _id: notificationId, recipient: userId }, { isRead: true }, { new: true });
});
/** Mark ALL notifications of a user as read */
const markAllAsRead = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
});
/** Delete a single notification */
const deleteNotification = (notificationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId,
    });
});
exports.NotificationServices = {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
