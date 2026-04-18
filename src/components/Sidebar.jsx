import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
      isActive
        ? "bg-blue-500 text-white shadow"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">

      {/* Logo */}
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        CRM 🚀
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 p-4 flex-1">

        <NavLink to="/" className={menuClass}>
          🏠 Dashboard
        </NavLink>

        <NavLink to="/applications" className={menuClass}>
          📄 Applications
        </NavLink>

        {/* Only Admin + Counsellor */}
        {(role === "admin" || role === "counsellor") && (
          <NavLink to="/students" className={menuClass}>
            👥 Students
          </NavLink>
        )}

        {/* Profile (all users) */}
        <NavLink to="/profile" className={menuClass}>
          👤 Profile
        </NavLink>

      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400 text-center">
        © 2026 CRM System
      </div>
    </div>
  );
};

export default Sidebar;