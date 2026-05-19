const admin = require("../config/firebase");
const Notification = require("../models/notification.model");
const User = require("../models/user.model");
const { emitToUser } = require("../socket/socket");


// CORE: Send notification — saves to DB + FCM + Socket
// This is the SINGLE entry point for all notifications in the app

/**
 * @param {Object} options
 * @param {string} options.recipientId     - User._id who receives
 * @param {string} [options.senderId]      - User._id who triggered (optional)
 * @param {string} options.type            - Notification type enum
 * @param {string} options.title           - Push title
 * @param {string} options.body            - Push body
 * @param {Object} [options.data]          - Extra key-value data (for deep linking)
 */
const sendNotification = async ({
  recipientId,
  senderId = null,
  type,
  title,
  body,
  data = {},
}) => {
  // ── Step 1: Save to DB first (source of truth) ──
  const notification = await Notification.create({
    recipient: recipientId,
    sender: senderId,
    type,
    title,
    body,
    // Map requires string values — coerce everything
    data: new Map(Object.entries(data).map(([k, v]) => [k, String(v)])),
    fcmStatus: "pending",
  });

  // ── Step 2: Try real-time Socket delivery ──
  const socketDelivered = emitToUser(recipientId.toString(), "new_notification", {
    _id: notification._id,
    type,
    title,
    body,
    data,
    isRead: false,
    createdAt: notification.createdAt,
  });

  if (socketDelivered) {
    notification.socketDelivered = true;
    // User is online — still send FCM for mobile/PWA background support
  }

  // ── Step 3: FCM Push Notification ──
  const user = await User.findById(recipientId).select("fcmToken");

  if (!user?.fcmToken) {
    // No device token — skip FCM, just mark as skipped
    notification.fcmStatus = "skipped";
    await notification.save();
    return notification;
  }

  try {
    const fcmPayload = {
      token: user.fcmToken,
      notification: {
        title,
        body,
      },
      data: {
        // FCM data must be string-string key-value
        notificationId: notification._id.toString(),
        type,
        ...Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, String(v)])
        ),
      },
      // Android config
      android: {
        priority: "high",
        notification: {
          clickAction: "FLUTTER_NOTIFICATION_CLICK",
          channelId: "crm_notifications",
        },
      },
      // Web (PWA) config
      webpush: {
        headers: { Urgency: "high" },
        notification: {
          title,
          body,
          icon: "/logo.png",
          badge: "/badge.png",
          requireInteraction: true,
        },
        fcmOptions: {
          link: buildDeepLink(type, data),
        },
      },
    };

    const fcmResponse = await admin.messaging().send(fcmPayload);

    notification.fcmStatus = "sent";
    notification.fcmMessageId = fcmResponse;
    await notification.save();

  } catch (fcmError) {
    console.error("FCM send error:", fcmError.code, fcmError.message);
    notification.fcmStatus = "failed";
    await notification.save();

    // If token is invalid — clear it from user so we don't retry
    if (
      fcmError.code === "messaging/registration-token-not-registered" ||
      fcmError.code === "messaging/invalid-registration-token"
    ) {
      await User.findByIdAndUpdate(recipientId, { $unset: { fcmToken: 1 } });
    }
  }

  return notification;
}

// BATCH: Send to multiple users at once (e.g. SLA alerts)

const sendBulkNotification = async ({ recipientIds, senderId, type, title, body, data = {} }) => {
  const results = await Promise.allSettled(
    recipientIds.map((recipientId) =>
      sendNotification({ recipientId, senderId, type, title, body, data })
    )
  );
  return results;
};

// HELPER: Build deep link URL from notification type

const buildDeepLink = (type, data) => {
  const base = process.env.FRONTEND_URL || "http://localhost:5173";
  const map = {
    application_update: `/applications`,
    document_request: `/documents/${data.applicationId || ""}`,
    document_approved: `/documents/${data.applicationId || ""}`,
    document_rejected: `/documents/${data.applicationId || ""}`,
    offer_received: `/applications`,
    visa_update: `/visa-checklist/${data.applicationId || ""}`,
    message: `/chat`,
    shortlist_update: `/shortlist`,
    feedback_request: `/feedback/${data.applicationId || ""}`,
    sla_alert: `/students`,
    system: `/`,
  };
  return `${base}${map[type] || "/"}`;
};

module.exports = { sendNotification, sendBulkNotification };