import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { NotificationControllers } from "./notification.controller";

export const notificationRoutes = Router();

// All routes require a logged-in user (any role)
notificationRoutes.use(
  checkAuth(Role.USER, Role.AGENT, Role.ADMIN)
);

notificationRoutes.get("/my", NotificationControllers.getMyNotifications);

notificationRoutes.patch("/read-all", NotificationControllers.markAllAsRead);

notificationRoutes.patch("/:id/read", NotificationControllers.markAsRead);

notificationRoutes.delete("/:id", NotificationControllers.deleteNotification);
