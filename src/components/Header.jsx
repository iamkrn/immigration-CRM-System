import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = ({ setSearch }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setInput(value);
    setSearch(value);
  };

  return (
    <div className="bg-white shadow-md px-6 py-3 flex justify-between items-center">

      {/* Left */}
      <h1 className="text-xl font-bold text-gray-800">
        CRM Dashboard
      </h1>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <input
          type="text"
          value={input}
          onChange={handleSearch}
          placeholder="Search..."
          className="border px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* User */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
          <img
            src="https://i.pravatar.cc/30"
            alt="user"
            className="rounded-full"
          />
          <span className="text-sm font-medium text-gray-700">
            {user?.name} ({user?.role})
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Header;