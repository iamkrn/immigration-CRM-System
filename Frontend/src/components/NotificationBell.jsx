import { useState, useRef, useEffect } from "react";
import { MdNotifications, MdDone, MdDoneAll, MdDelete, MdCircle } from "react-icons/md";
import useNotifications from "../hooks/useNotification";

// ── Icon per notification type ──
const TYPE_ICON = {
  application_update: "📋",
  document_request: "📄",
  document_approved: "✅",
  document_rejected: "❌",
  offer_received: "🎓",
  visa_update: "🛂",
  message: "💬",
  shortlist_update: "📌",
  system: "⚙️",
  sla_alert: "⚠️",
  feedback_request: "⭐",
};

// ── Time ago helper ──
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const NotificationBell = ({ socket }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(socket);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
        style={{ background: isOpen ? "#dbeafe" : "#f1f5f9" }}
      >
        <MdNotifications
          size={18}
          style={{ color: isOpen ? "#3b82f6" : "#64748b" }}
        />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white font-bold"
            style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              fontSize: "10px",
              padding: "0 4px",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-96 rounded-2xl overflow-hidden z-50"
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            top: "100%",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid #f1f5f9" }}
          >
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#dbeafe", color: "#3b82f6" }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-semibold transition-all"
                style={{ color: "#3b82f6" }}
              >
                <MdDoneAll size={14} />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
            {notifications.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <MdNotifications size={36} style={{ color: "#cbd5e1" }} />
                <p className="text-sm text-gray-400 font-medium">No notifications yet</p>
              </div>
            ) : (
              <>
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className="flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-all group"
                    style={{
                      background: n.isRead ? "white" : "rgba(59,130,246,0.04)",
                      borderBottom: "1px solid #f8fafc",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = n.isRead
                        ? "white"
                        : "rgba(59,130,246,0.04)";
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                      style={{ background: "#f1f5f9" }}
                    >
                      {TYPE_ICON[n.type] || "🔔"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className="text-sm font-semibold text-gray-800 leading-tight"
                          style={{ fontWeight: n.isRead ? 500 : 700 }}
                        >
                          {n.title}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!n.isRead && (
                            <MdCircle size={8} style={{ color: "#3b82f6" }} />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(n._id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "#94a3b8" }}
                          >
                            <MdDelete size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {n.body}
                      </p>

                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs" style={{ color: "#94a3b8" }}>
                          {timeAgo(n.createdAt)}
                        </span>
                        {!n.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(n._id);
                            }}
                            className="flex items-center gap-0.5 text-xs font-medium"
                            style={{ color: "#3b82f6" }}
                          >
                            <MdDone size={12} />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load More */}
                {hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="w-full py-3 text-xs font-semibold transition-all"
                    style={{
                      color: "#3b82f6",
                      borderTop: "1px solid #f1f5f9",
                      background: loading ? "#f8fafc" : "white",
                    }}
                  >
                    {loading ? "Loading..." : "Load more"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;