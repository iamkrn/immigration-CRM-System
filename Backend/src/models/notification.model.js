const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    // Recipient of the notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,            // Fast lookup by user
    },

    // Who triggered the notification (nullable — system events have no sender)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Notification type — controls icon & routing on frontend
    type: {
      type: String,
      enum: [
        "application_update",   // Application status changed
        "document_request",     // Counsellor requested a document
        "document_approved",    // Document approved
        "document_rejected",    // Document rejected
        "offer_received",       // Offer letter uploaded
        "visa_update",          // Visa status changed
        "message",              // New chat message
        "shortlist_update",     // University shortlist changed
        "system",               // Generic system notification
        "sla_alert",            // SLA breach warning
        "feedback_request",     // Feedback requested after admission
      ],
      required: true,
    },

    // Human-readable content
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },

    body: {
      type: String,
      required: true,
      maxlength: 500,
    },

    // Deep link data — frontend uses this to navigate
    data: {
      type: Map,
      of: String,
      default: {},
    },

    // Read/Unread state
    isRead: {
      type: Boolean,
      default: false,
      index: true,              // Fast unread count queries
    },

    readAt: {
      type: Date,
      default: null,
    },

    // FCM delivery tracking
    fcmStatus: {
      type: String,
      enum: ["pending", "sent", "failed", "skipped"],
      default: "pending",
    },

    fcmMessageId: {
      type: String,
      default: null,
    },

    // Was user online when notification sent? (Socket delivered)
    socketDelivered: {
      type: Boolean,
      default: false,
    },

    // Soft delete
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    // Compound index: fast "get unread notifications for user"
    indexes: [
      { recipient: 1, isRead: 1, createdAt: -1 },
      { recipient: 1, createdAt: -1 },
    ],
  }
);

// Virtual: age of notification
notificationSchema.virtual("age").get(function () {
  return Date.now() - this.createdAt;
});

// Instance method: mark as read
notificationSchema.methods.markRead = async function () {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

// Static: unread count for a user
notificationSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({
    recipient: userId,
    isRead: false,
    deletedAt: null,
  });
};

module.exports = mongoose.model("Notification", notificationSchema);