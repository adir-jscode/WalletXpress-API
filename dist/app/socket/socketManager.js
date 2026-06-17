"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitToUser = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const env_1 = require("../config/env");
const jwt_1 = require("../utils/jwt");
// userId -> Set of socket ids (one user can have multiple tabs)
const userSocketMap = new Map();
let io;
const initSocket = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: ["http://localhost:5173", env_1.envVars.FRONTEND_URL],
            credentials: true,
        },
    });
    // --- Auth middleware: validate JWT before allowing connection ---
    io.use((socket, next) => {
        var _a, _b;
        try {
            const token = ((_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) || ((_b = socket.handshake.headers) === null || _b === void 0 ? void 0 : _b.authorization);
            if (!token) {
                return next(new Error("Authentication token missing"));
            }
            const decoded = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_ACCESS_SECRET);
            // Attach decoded user to socket data for later use
            socket.data.userId = decoded.id;
            socket.data.role = decoded.role;
            next();
        }
        catch (_c) {
            next(new Error("Invalid or expired token"));
        }
    });
    io.on("connection", (socket) => {
        const userId = socket.data.userId;
        // Register socket under this user
        if (!userSocketMap.has(userId)) {
            userSocketMap.set(userId, new Set());
        }
        userSocketMap.get(userId).add(socket.id);
        socket.on("disconnect", () => {
            const sockets = userSocketMap.get(userId);
            if (sockets) {
                sockets.delete(socket.id);
                if (sockets.size === 0) {
                    userSocketMap.delete(userId);
                }
            }
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialised. Call initSocket() first.");
    }
    return io;
};
exports.getIO = getIO;
/**
 * Emit an event to ALL active sockets of a specific user.
 * Safe to call even if the user is not currently connected.
 */
const emitToUser = (userId, event, payload) => {
    const io = (0, exports.getIO)();
    const sockets = userSocketMap.get(userId);
    if (!sockets || sockets.size === 0)
        return;
    sockets.forEach((socketId) => {
        io.to(socketId).emit(event, payload);
    });
};
exports.emitToUser = emitToUser;
