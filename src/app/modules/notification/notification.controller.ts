import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { NotificationServices } from "./notification.service";

/** GET /api/v1/notification/my */
const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const notifications = await NotificationServices.getMyNotifications(
    req.user.id
  );
  const unreadCount = await NotificationServices.getUnreadCount(req.user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notifications retrieved successfully",
    data: { notifications, unreadCount },
  });
});

/** PATCH /api/v1/notification/:id/read */
const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const notification = await NotificationServices.markAsRead(
    req.params.id,
    req.user.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification marked as read",
    data: notification,
  });
});

/** PATCH /api/v1/notification/read-all */
const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  await NotificationServices.markAllAsRead(req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All notifications marked as read",
    data: null,
  });
});

/** DELETE /api/v1/notification/:id */
const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  await NotificationServices.deleteNotification(req.params.id, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification deleted",
    data: null,
  });
});

export const NotificationControllers = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
