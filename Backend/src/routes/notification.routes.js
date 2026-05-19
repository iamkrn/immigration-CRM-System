const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  saveFcmToken,
} = require("../controllers/notification.controller");

// All routes require authentication
router.use(authMiddleware);

router.get("/", getNotifications);                        // GET  /api/notifications
router.get("/unread-count", getUnreadCount);              // GET  /api/notifications/unread-count
router.post("/save-token", saveFcmToken);                 // POST /api/notifications/save-token
router.patch("/read-all", markAllAsRead);                 // PATCH /api/notifications/read-all
router.patch("/:id/read", markAsRead);                    // PATCH /api/notifications/:id/read
router.delete("/:id", deleteNotification);                // DELETE /api/notifications/:id

module.exports = router;