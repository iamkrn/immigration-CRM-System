import { useState, useEffect, useCallback, useRef } from "react";
import API from "../services/API";

const UseNotification = (socket) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const initialized = useRef(false);

  // ── Fetch initial notifications ──
  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await API.get(`/notifications?page=${pageNum}&limit=20`);
      const { notifications: newItems, unreadCount: count, pagination } = res.data.data;

      setNotifications((prev) => append ? [...prev, ...newItems] : newItems);
      setUnreadCount(count);
      setHasMore(pagination.hasMore);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Load more (pagination) ──
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  }, [page, hasMore, loading, fetchNotifications]);

  // ── Mark single as read ──
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await API.patch(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  }, []);

  // ── Mark all as read ──
  const markAllAsRead = useCallback(async () => {
    try {
      await API.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }, []);

  // ── Delete notification ──
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await API.delete(`/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  }, []);

  // ── Handle new incoming notification (from Socket or FCM foreground) ──
  const addIncomingNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Show in-app toast (browser Notification API — only if app is focused)
    if (document.hasFocus() && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.body,
        icon: "/logo.png",
      });
    }
  }, []);

  // ── Socket listener: real-time notifications ──
  useEffect(() => {
    if (!socket?.current) return;
    const s = socket.current;

    s.on("new_notification", addIncomingNotification);

    return () => {
      s.off("new_notification", addIncomingNotification);
    };
  }, [socket, addIncomingNotification]);

  // ── FCM foreground listener ──
  useEffect(() => {
    const handleFCMForeground = (event) => {
      const payload = event.detail;
      addIncomingNotification({
        _id: payload.data?.notificationId,
        type: payload.data?.type,
        title: payload.notification?.title,
        body: payload.notification?.body,
        isRead: false,
        createdAt: new Date().toISOString(),
        data: payload.data,
      });
    };

    window.addEventListener("fcm_foreground_notification", handleFCMForeground);
    return () => window.removeEventListener("fcm_foreground_notification", handleFCMForeground);
  }, [addIncomingNotification]);

  // ── Initial fetch ──
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?._id && !initialized.current) {
      initialized.current = true;
      fetchNotifications(1);
    }
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: () => fetchNotifications(1),
  };
};

export default UseNotification;