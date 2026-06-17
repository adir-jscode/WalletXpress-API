"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notification_interface_1 = require("./notification.interface");
const notificationSchema = new mongoose_1.Schema({
    recipient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: Object.values(notification_interface_1.NotificationType),
        required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    amount: { type: Number, required: true },
    isRead: { type: Boolean, default: false },
    transactionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Transaction",
    },
}, { timestamps: true, versionKey: false });
exports.Notification = (0, mongoose_1.model)("Notification", notificationSchema);
