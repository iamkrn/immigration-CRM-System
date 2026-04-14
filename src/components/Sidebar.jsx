import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-blue-500 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      
      {/* Logo / Title */}
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        CRM 🚀
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 p-4">

        <NavLink to="/" className={menuClass}>
          🏠 Dashboard
        </NavLink>

        <NavLink to="/customers" className={menuClass}>
          👥 Customers
        </NavLink>

        <NavLink to="/applications" className={menuClass}>
          📄 Applications
        </NavLink>

        <NavLink to="/documents" className={menuClass}>
          📁 Documents
        </NavLink>  
        <NavLink to="/profile" className={menuClass}>
          Profile
        </NavLink>


      </nav>

      {/* Bottom Section */}
      <div className="mt-auto p-4 border-t border-gray-700 text-sm text-gray-400">
        © 2026 CRM
      </div>
    </div>
  );
};

export default Sidebar;