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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const notification_service_1 = require("./notification.service");
/** GET /api/v1/notification/my */
const getMyNotifications = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield notification_service_1.NotificationServices.getMyNotifications(req.user.id);
    const unreadCount = yield notification_service_1.NotificationServices.getUnreadCount(req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Notifications retrieved successfully",
        data: { notifications, unreadCount },
    });
}));
/** PATCH /api/v1/notification/:id/read */
const markAsRead = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield notification_service_1.NotificationServices.markAsRead(req.params.id, req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Notification marked as read",
        data: notification,
    });
}));
/** PATCH /api/v1/notification/read-all */
const markAllAsRead = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield notification_service_1.NotificationServices.markAllAsRead(req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All notifications marked as read",
        data: null,
    });
}));
/** DELETE /api/v1/notification/:id */
const deleteNotification = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield notification_service_1.NotificationServices.deleteNotification(req.params.id, req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Notification deleted",
        data: null,
    });
}));
exports.NotificationControllers = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
