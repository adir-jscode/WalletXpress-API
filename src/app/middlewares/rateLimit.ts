import { NextFunction, Request, Response } from "express";

const rateLimitWindow = 60 * 1000; // 1 minute
const maxRequests = 5;

interface IRequestInfo {
  count: number;
  startTime: number;
}

const ipRequests: Record<string, IRequestInfo> = {};

export const rateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const ip = req.ip || req.socket.remoteAddress;

  if (!ip) {
    res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Unable to determine IP address",
    });
    return;
  }

  const currentTime = Date.now();

  // First request from this IP
  if (!ipRequests[ip]) {
    ipRequests[ip] = {
      count: 1,
      startTime: currentTime,
    };
  } else {
    const elapsedTime = currentTime - ipRequests[ip].startTime;

    // Window expired -> reset
    if (elapsedTime > rateLimitWindow) {
      ipRequests[ip] = {
        count: 1,
        startTime: currentTime,
      };
    } else {
      ipRequests[ip].count++;
    }
  }

  // Check limit

  if (ipRequests[ip].count > maxRequests) {
    res.status(429).json({
      statusCode: 429,
      success: false,
      message: "Too many requests. Please try again later.",
    });
    return;
  }

  next();
};
