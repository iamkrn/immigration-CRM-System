import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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

        {/* All  */}
        <NavLink to="/" end className={menuClass}>
          🏠 Dashboard
        </NavLink>

        {/* only Admin + Counsellor */}
        {(role === "admin" || role === "counsellor") && (
          <>
            <NavLink to="/customers" className={menuClass}>
              👥 Customers
            </NavLink>

            <NavLink to="/applications" className={menuClass}>
              📄 Applications
            </NavLink>
          </>
        )}

        {/* onlyStudent */}
        {role === "student" && (
          <NavLink to="/applications" className={menuClass}>
            📄 My Applications
          </NavLink>
        )}

        {/* Sab ko */}
        <NavLink to="/profile" className={menuClass}>
          👤 Profile
        </NavLink>

      </nav>

      {/* Logout bottom mein */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition"
        >
          🚪 Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;