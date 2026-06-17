"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = void 0;
const rateLimitWindow = 60 * 1000; // 1 minute
const maxRequests = 5;
const ipRequests = {};
const rateLimitMiddleware = (req, res, next) => {
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
    }
    else {
        const elapsedTime = currentTime - ipRequests[ip].startTime;
        // Window expired -> reset
        if (elapsedTime > rateLimitWindow) {
            ipRequests[ip] = {
                count: 1,
                startTime: currentTime,
            };
        }
        else {
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
exports.rateLimitMiddleware = rateLimitMiddleware;
