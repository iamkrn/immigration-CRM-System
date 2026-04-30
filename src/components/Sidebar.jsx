import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdDescription,
  MdPerson,
  MdLogout,
  MdSchool
} from "react-icons/md";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
      isActive
        ? "text-white shadow-lg"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  const activeStyle = {
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    boxShadow: "0 4px 15px rgba(59,130,246,0.3)"
  };

  return (
    <div className="w-64 flex flex-col min-h-screen"
      style={{ background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.06)" }}>

      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
            360
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-tight">
              College Review
            </p>
            <p className="text-xs capitalize"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              {role}
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1 p-4 flex-1">

        <p className="text-xs font-semibold mb-2 px-2"
          style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "1px" }}>
          MAIN MENU
        </p>

        {/* Dashboard — sab ko */}
        <NavLink to="/" end
          className={menuClass}
          style={({ isActive }) => isActive ? activeStyle : {}}
        >
          <MdDashboard size={18} />
          Dashboard
        </NavLink>

        {/* Admin + Counsellor + SuperAdmin */}
        {(role === "admin" || role === "counsellor" || role === "superAdmin") && (
          <>
            <NavLink to="/customers"
              className={menuClass}
              style={({ isActive }) => isActive ? activeStyle : {}}
            >
              <MdPeople size={18} />
              Customers
            </NavLink>

            <NavLink to="/students"
              className={menuClass}
              style={({ isActive }) => isActive ? activeStyle : {}}
            >
              <MdSchool size={18} />
              Students
            </NavLink>

            <NavLink to="/applications"
              className={menuClass}
              style={({ isActive }) => isActive ? activeStyle : {}}
            >
              <MdDescription size={18} />
              Applications
            </NavLink>
          </>
        )}

        {/* Student only */}
        {role === "student" && (
          <NavLink to="/applications"
            className={menuClass}
            style={({ isActive }) => isActive ? activeStyle : {}}
          >
            <MdDescription size={18} />
            My Applications
          </NavLink>
        )}

        <div className="my-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }} />

        <NavLink to="/profile"
          className={menuClass}
          style={({ isActive }) => isActive ? activeStyle : {}}
        >
          <MdPerson size={18} />
          Profile
        </NavLink>

      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
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

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "rgba(239,68,68,0.1)",
            color: "#f87171",
            border: "1px solid rgba(239,68,68,0.2)"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
        >
          <MdLogout size={16} />
          Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;