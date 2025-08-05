import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Set up Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST"],
  },
});

// Track connected users: userId -> socketId
const userSocketMap = {};

// Helper to get socket ID by user ID
export const getSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`🔌 User connected: ${userId} -> ${socket.id}`);
  }

  // Notify all clients about the current online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log(`❌ User disconnected: ${userId}`);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

// Export app, io and server for server startup
export { app, io, server };