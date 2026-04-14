import { useNavigate } from "react-router-dom";
import { useState } from "react";



const Header = ({setSearch}) => {
  const navigate = useNavigate()
  const [input, setInput] = useState("");

    const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setInput(value);
    setSearch(value)//send to parent
  }

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      
      {/* Left */}
      <h1 className="text-xl font-semibold text-gray-800">
        CRM Dashboard
      </h1>

      {/* Right */}
      <div className="flex items-center gap-4">

        
        <input
          type="text"
          value={input}
          onChange={handleSearch}
          placeholder="Search customers..."
          className="border px-3 py-1 rounded-lg outline-none"
        />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>


        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://i.pravatar.cc/30"
            alt="user"
            className="rounded-full"
          />
          <span className="text-sm text-gray-700">Admin</span>
        </div>

      </div>
    </div>
  );
};

export default Header;