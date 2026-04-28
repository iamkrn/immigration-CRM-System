import React, { useEffect, useState } from "react";
import API from "../services/API";
import StatsChart from "../components/StatsChart";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!data) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          <p className={`text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-linear-to-br from-gray-50 to-gray-100"}`}>
      {/* Header */}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome + Dark Mode Toggle */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Welcome back, {user?.name}! 👋
              </h1>
              <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Role: <span className="font-semibold text-blue-500 capitalize">{role}</span>
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-3 rounded-lg text-xl transition-all ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-100 shadow"
              }`}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
                  {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {/* Admin */}
          {role === "admin" && (
            <>
              <Card
                title="Total Students"
                value={data.totalStudents}
                icon="👥"
                gradient="from-blue-500 to-blue-600"
                isDark={isDarkMode}
              />
              <Card
                title="Applications"
                value={data.totalApplications}
                icon="📋"
                gradient="from-green-500 to-green-600"
                isDark={isDarkMode}
              />
              <Card
                title="Documents"
                value={data.totalDocuments}
                icon="📄"
                gradient="from-purple-500 to-purple-600"
                isDark={isDarkMode}
              />
            </>
          )}

          {/* Counsellor */}
          {role === "counsellor" && (
            <>
              <Card
                title="Applications"
                value={data.totalApplications}
                icon="📋"
                gradient="from-green-500 to-green-600"
                isDark={isDarkMode}
              />
              <Card
                title="Pending Docs"
                value={data.pendingDocs}
                icon="⏳"
                gradient="from-yellow-500 to-yellow-600"
                isDark={isDarkMode}
              />
              <Card
                title="Approved"
                value={data.approvedDocs || 0}
                icon="✅"
                gradient="from-emerald-500 to-emerald-600"
                isDark={isDarkMode}
              />
            </>
          )}

          {/* Student */}
          {role === "student" && (
            <>
              <Card
                title="My Documents"
                value={data.totalDocuments}
                icon="📄"
                gradient="from-purple-500 to-purple-600"
                isDark={isDarkMode}
              />
              <Card
                title="Pending"
                value={data.pendingDocs}
                icon="⏳"
                gradient="from-yellow-500 to-yellow-600"
                isDark={isDarkMode}
              />
              <Card
                title="Approved"
                value={data.approvedDocs || 0}
                icon="✅"
                gradient="from-emerald-500 to-emerald-600"
                isDark={isDarkMode}
              />
            </>
          )}
        </div>

        {/* Charts Section */}
        {(role === "admin" || role === "counsellor") && (
          <StatsChart data={data} isDark={isDarkMode} />
        )}
      </div>
    </div>
  );
};

const Card = ({ title, value, icon, gradient, isDark }) => {
  return (
    <div
      className={`group overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className={`bg-linear-to-br ${gradient} p-6 text-white relative overflow-hidden`}>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h3 className="text-sm font-medium opacity-90 mb-2">{title}</h3>
            <p className="text-4xl font-bold">{value}</p>
          </div>
          <span className="text-5xl opacity-30 group-hover:opacity-50 transition-opacity">{icon}</span>
        </div>
      </div>
      <div className={`px-6 py-3 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
        <p className={`text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
          Total Count
        </p>
      </div>
    </div>
  );
};

export default Dashboard;