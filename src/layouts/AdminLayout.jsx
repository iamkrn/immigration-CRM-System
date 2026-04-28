import { Outlet, NavLink, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
      isActive
        ? "bg-blue-500 text-white shadow"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">

        {/* Logo */}
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          360 CRM ⚙️
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-2 p-4 flex-1">
          <NavLink to="/admin/dashboard" className={menuClass}>
            🏠 Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={menuClass}>
            👥 Manage Users
          </NavLink>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-3 text-center">
            {user?.name} — Admin
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition"
          >
            🚪 Logout
          </button>
        </div>

      </div>

      {/* Right Side */}
      <div className="flex flex-col flex-1 ml-64">

        {/* Top Header */}
        <div className="bg-white shadow px-6 py-3 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-lg font-bold text-gray-800">
            Admin Panel
          </h1>
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
            <img
              src="https://i.pravatar.cc/30"
              className="rounded-full"
            />
            <span className="text-sm font-medium text-gray-700">
              {user?.name}
            </span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="bg-white border-t py-3 text-center text-xs text-gray-400">
          © 2026 CRM System • All rights reserved
        </div>

      </div>

    </div>
  );
};

export default AdminLayout;