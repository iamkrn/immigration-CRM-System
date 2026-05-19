import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdSearch, MdLogout } from "react-icons/md";
import NotificationBell from "./NotificationBell";  


const Header = ({ setSearch,socket }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("fcmToken");             
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setInput(value);
    if(setSearch) setSearch(value);
  };

  return (
    <div className="px-6 py-3 flex justify-between items-center sticky top-0 z-50"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 20px rgba(0,0,0,0.06)"
      }}>

      {/* Left — Title */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full"
          style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }} />
        <h1 className="text-lg font-bold text-gray-800" style={{ letterSpacing: "-0.5px" }}>
          CRM Dashboard
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="relative flex items-center">
          <MdSearch size={18} className="absolute left-3 text-gray-400" />
          <input
            type="text"
            value={input}
            onChange={handleSearch}
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm rounded-xl outline-none border border-gray-200 bg-gray-50 text-gray-700 transition-all w-48 focus:w-64"
            style={{ transition: "width 0.3s ease" }}
            onFocus={e => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.background = "white";
            }}
            onBlur={e => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.background = "#f9fafb";
            }}
          />
        </div>

        {/* Notification */}
        <NotificationBell socket={socket} />
          
        {/* User Info */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 leading-none">
              {user?.name}
            </p>
            <p className="text-xs capitalize mt-0.5"
              style={{ color: "#94a3b8" }}>
              {user?.role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "rgba(239,68,68,0.08)",
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.15)"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
        >
          <MdLogout size={15} />
          <span className="hidden sm:block">Logout</span>
        </button>

      </div>
    </div>
  );
};

export default Header;