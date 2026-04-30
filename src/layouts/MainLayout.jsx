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

         <div className="flex-1 overflow-y-auto" style={{ background: "#f8fafc" }}>
            <Outlet context={{search}} />
        </div>

      </div>

      {/* Footer (optional) */}
       <Footer /> 

    </div>
  );
};

export default MainLayout;