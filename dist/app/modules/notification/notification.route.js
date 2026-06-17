"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const notification_controller_1 = require("./notification.controller");
exports.notificationRoutes = (0, express_1.Router)();
// All routes require a logged-in user (any role)
exports.notificationRoutes.use((0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT, user_interface_1.Role.ADMIN));
exports.notificationRoutes.get("/my", notification_controller_1.NotificationControllers.getMyNotifications);
exports.notificationRoutes.patch("/read-all", notification_controller_1.NotificationControllers.markAllAsRead);
exports.notificationRoutes.patch("/:id/read", notification_controller_1.NotificationControllers.markAsRead);
exports.notificationRoutes.delete("/:id", notification_controller_1.NotificationControllers.deleteNotification);
