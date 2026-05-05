const { Server } = require("socket.io");

let io;

// Online users store — { userId: socketId }
const userSocketMap = {};

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

    // ── Step 1: User send their userId after login ──
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} mapped to socket ${socket.id}`);
    }

    // Online users broadcast for connection and disconnection
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // ── Step 2: Student  joined the specific room──
    socket.on("joinRoom", (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined room: ${chatId}`);
    });

    // ── Step 3: Message send to the room ──
    socket.on("sendMessage", ({ chatId, message }) => {
      // Room ke saare members ko message milega
      io.to(chatId).emit("receiveMessage", message);
    });

    // ── Step 4: Typing indicator ──
    socket.on("typing", ({ chatId, senderId }) => {
      socket.to(chatId).emit("userTyping", { senderId });
    });

    socket.on("stopTyping", ({ chatId }) => {
      socket.to(chatId).emit("userStopTyping");
    });

    // ── Step 5: Disconnect ──
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // remove from map
      for (const [uid, sid] of Object.entries(userSocketMap)) {
        if (sid === socket.id) {
          delete userSocketMap[uid];
          break;
        }
      }

      // Updated online users broadcast
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

        // message send to the specific user from any controller
        const getReceiverSocketId = (receiverId) => {
        return userSocketMap[receiverId];
        };

        // io  instance used for global emits from controllers
        const getIO = () => {
        if (!io) throw new Error("Socket.io not initialized");
        return io;
        };

module.exports = { initSocket, getReceiverSocketId, getIO };