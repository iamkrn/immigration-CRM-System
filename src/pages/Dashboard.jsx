import React, { useEffect, useState } from "react";
import API from "../services/API";
import StatsChart from "../components/StatsChart";
import {
  MdPeople, MdDescription, MdFolder,
  MdPendingActions, MdCheckCircle, MdTrendingUp
} from "react-icons/md";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen"
        style={{ background: "#f8fafc" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-transparent border-t-blue-500 rounded-full animate-spin"
            style={{ borderWidth: "3px", borderTopColor: "#3b82f6" }} />
          <p className="text-sm text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen" style={{ background: "#f8fafc" }}>

      {/* Welcome Section */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#3b82f6" }}>
            OVERVIEW
          </p>
          <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.5px" }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your CRM today
          </p>
        </div>

        {/* Role Badge */}
        <div className="px-4 py-2 rounded-xl text-sm font-bold capitalize"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "white",
            boxShadow: "0 4px 15px rgba(59,130,246,0.3)"
          }}>
          {role}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">

        {/* Admin + SuperAdmin */}
        {(role === "admin" || role === "superAdmin") && (
          <>
            <Card
              title="Total Students"
              value={data.totalStudents}
              icon={<MdPeople size={22} />}
              color="#3b82f6"
              bg="rgba(59,130,246,0.08)"
              trend="+12%"
            />
            <Card
              title="Applications"
              value={data.totalApplications}
              icon={<MdDescription size={22} />}
              color="#10b981"
              bg="rgba(16,185,129,0.08)"
              trend="+8%"
            />
            <Card
              title="Documents"
              value={data.totalDocuments}
              icon={<MdFolder size={22} />}
              color="#8b5cf6"
              bg="rgba(139,92,246,0.08)"
              trend="+5%"
            />
          </>
        )}

        {/* Counsellor */}
        {role === "counsellor" && (
          <>
            <Card
              title="Applications"
              value={data.totalApplications}
              icon={<MdDescription size={22} />}
              color="#10b981"
              bg="rgba(16,185,129,0.08)"
              trend="+8%"
            />
            <Card
              title="Pending Docs"
              value={data.pendingDocs}
              icon={<MdPendingActions size={22} />}
              color="#f59e0b"
              bg="rgba(245,158,11,0.08)"
              trend="Action needed"
            />
            <Card
              title="Approved"
              value={data.approvedDocs || 0}
              icon={<MdCheckCircle size={22} />}
              color="#10b981"
              bg="rgba(16,185,129,0.08)"
              trend="This month"
            />
          </>
        )}

        {/* Student */}
        {role === "student" && (
          <>
            <Card
              title="My Documents"
              value={data.totalDocuments}
              icon={<MdFolder size={22} />}
              color="#8b5cf6"
              bg="rgba(139,92,246,0.08)"
              trend="Uploaded"
            />
            <Card
              title="Pending"
              value={data.pendingDocs}
              icon={<MdPendingActions size={22} />}
              color="#f59e0b"
              bg="rgba(245,158,11,0.08)"
              trend="Action needed"
            />
            <Card
              title="Approved"
              value={data.approvedDocs || 0}
              icon={<MdCheckCircle size={22} />}
              color="#10b981"
              bg="rgba(16,185,129,0.08)"
              trend="Completed"
            />
          </>
        )}

      </div>

      {/* Charts */}
      {(role === "admin" || role === "counsellor" || role === "superAdmin") && (
        <div className="bg-white rounded-2xl p-6"
          style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 20px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-2 mb-6">
            <MdTrendingUp size={20} style={{ color: "#3b82f6" }} />
            <h2 className="font-bold text-gray-800">Analytics Overview</h2>
          </div>
          <StatsChart data={data} isDark={false} />
        </div>
      )}

    </div>
  );
};

const Card = ({ title, value, icon, color, bg, trend }) => (
  <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
    style={{
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 1px 20px rgba(0,0,0,0.04)",
      cursor: "pointer"
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.1)`}
    onMouseLeave={e => e.currentTarget.style.boxShadow = `0 1px 20px rgba(0,0,0,0.04)`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: bg, color: color }}>
        {icon}
      </div>
      <span className="text-xs font-semibold px-2 py-1 rounded-lg"
        style={{ background: bg, color: color }}>
        {trend}
      </span>
    </div>

    <p className="text-3xl font-black text-gray-900 mb-1"
      style={{ letterSpacing: "-1px" }}>
      {value ?? 0}
    </p>
    <p className="text-sm text-gray-500 font-medium">{title}</p>

    {/* Bottom line */}
    <div className="mt-4 h-1 rounded-full" style={{ background: bg }}>
      <div className="h-1 rounded-full w-2/3" style={{ background: color }} />
    </div>
  </div>
);

export default Dashboard;