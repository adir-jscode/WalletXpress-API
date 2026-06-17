import { Server as HttpServer } from "http";
import { JwtPayload } from "jsonwebtoken";
import { Socket, Server as SocketIOServer } from "socket.io";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";

// userId -> Set of socket ids (one user can have multiple tabs)
const userSocketMap = new Map<string, Set<string>>();

let io: SocketIOServer;

export const initSocket = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: ["http://localhost:5173", envVars.FRONTEND_URL],
      credentials: true,
    },
  });

  // --- Auth middleware: validate JWT before allowing connection ---
  io.use((socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token || socket.handshake.headers?.authorization;

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      const decoded = verifyToken(
        token,
        envVars.JWT_ACCESS_SECRET,
      ) as JwtPayload;

      // Attach decoded user to socket data for later use
      socket.data.userId = decoded.id as string;
      socket.data.role = decoded.role as string;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId as string;

    // Register socket under this user
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId)!.add(socket.id);

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

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io not initialised. Call initSocket() first.");
  }
  return io;
};

/**
 * Emit an event to ALL active sockets of a specific user.
 * Safe to call even if the user is not currently connected.
 */
export const emitToUser = (
  userId: string,
  event: string,
  payload: unknown,
): void => {
  const io = getIO();
  const sockets = userSocketMap.get(userId);
  if (!sockets || sockets.size === 0) return;

  sockets.forEach((socketId) => {
    io.to(socketId).emit(event, payload);
  });
};
