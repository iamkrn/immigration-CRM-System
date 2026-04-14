import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [search, setSearch] = useState("")
  return (
    <div className="flex flex-col h-screen">
      
      {/* Header */}
      <Header setSearch={setSearch} />

      {/* Main Section */}
      <div className="flex flex-1 overflow-hidden">
        
        <Sidebar />

        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
          <Outlet context={{search}} />
        </div>

      </div>

      {/* Footer (optional) */}
       <Footer /> 

    </div>
  );
};

export default MainLayout;