const { Server } = require("socket.io");

let io;

// Online users store — { userId: socketId }
const userSocketMap = {};

// ─────────────────────────────────────────────
// INIT SOCKET
// ─────────────────────────────────────────────
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ── Step 1: Register userId → socketId mapping ──
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} mapped to socket ${socket.id}`);
    }

    // Broadcast updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // ── Step 2: Join specific chat room ──
    socket.on("joinRoom", (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined room: ${chatId}`);
    });

    // ── Step 3: Typing indicators ──
    socket.on("typing", ({ chatId, senderId }) => {
      socket.to(chatId).emit("userTyping", { senderId });
    });

    socket.on("stopTyping", ({ chatId }) => {
      socket.to(chatId).emit("userStopTyping");
    });

    // ── Step 4: Disconnect — cleanup ──
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (const [uid, sid] of Object.entries(userSocketMap)) {
        if (sid === socket.id) {
          delete userSocketMap[uid];
          break;
        }
      }

      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

// ─────────────────────────────────────────────
// HELPERS — module scope pe hain (✅ sahi jagah)
// ─────────────────────────────────────────────

// Kisi bhi controller se specific user ka socketId lene ke liye
const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId?.toString()];
};

// Global io instance lene ke liye
const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized yet!");
  return io;
};

// Real-time notification emit — userId ke socket pe directly
const emitToUser = (userId, event, data) => {
  const socketId = userSocketMap[userId?.toString()];
  if (socketId && io) {
    io.to(socketId).emit(event, data);
    return true; // successfully emitted
  }
  return false; // user offline
};

// ─────────────────────────────────────────────
module.exports = { initSocket, getReceiverSocketId, getIO, emitToUser };