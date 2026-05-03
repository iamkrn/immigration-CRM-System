import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard, MdManageAccounts, MdSchool,
  MdPeople, MdDescription, MdPerson, MdLogout
} from "react-icons/md";

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive ? "text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  const activeStyle = {
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    boxShadow: "0 4px 15px rgba(59,130,246,0.3)"
  };

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-64 flex flex-col fixed h-full"
        style={{ background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              360
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-tight">College Review</p>
              <p className="text-xs capitalize" style={{ color: "rgba(255,255,255,0.3)" }}>
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-4 flex-1">
          <p className="text-xs font-semibold mb-2 px-2"
            style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "1px" }}>
            ADMIN MENU
          </p>

          <NavLink to="/admin/dashboard" className={menuClass} style={({ isActive }) => isActive ? activeStyle : {}}>
            <MdDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={menuClass} style={({ isActive }) => isActive ? activeStyle : {}}>
            <MdManageAccounts size={18} /> Manage Users
          </NavLink>
          <NavLink to="/admin/students" className={menuClass} style={({ isActive }) => isActive ? activeStyle : {}}>
            <MdSchool size={18} /> Students
          </NavLink>
          <NavLink to="/admin/customers" className={menuClass} style={({ isActive }) => isActive ? activeStyle : {}}>
            <MdPeople size={18} /> Customers
          </NavLink>
          <NavLink to="/admin/applications" className={menuClass} style={({ isActive }) => isActive ? activeStyle : {}}>
            <MdDescription size={18} /> Applications
          </NavLink>

          <div className="my-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }} />

          <NavLink to="/admin/profile" className={menuClass} style={({ isActive }) => isActive ? activeStyle : {}}>
            <MdPerson size={18} /> Profile
          </NavLink>
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                {user?.email}
              </p>
            </div>
          </div>

          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "rgba(239,68,68,0.1)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.2)"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
          >
            <MdLogout size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col flex-1 ml-64">

        {/* Top Header */}
        <div className="px-6 py-3 flex justify-between items-center sticky top-0 z-10"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 1px 20px rgba(0,0,0,0.06)"
          }}>
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }} />
            <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl"
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ background: "#f8fafc" }}>
          <Outlet />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 flex justify-between items-center text-xs"
          style={{
            background: "rgba(255,255,255,0.95)",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            color: "#94a3b8"
          }}>
          <span>© 2026 <strong style={{ color: "#3b82f6" }}>360 College Review</strong> • All rights reserved</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;