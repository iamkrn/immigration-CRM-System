import { useEffect, useState } from "react";
import API from "../../services/API";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  MdPeople, MdDescription, MdFolder,
  MdPendingActions, MdManageAccounts,
  MdSchool, MdBusiness, MdZoomIn
} from "react-icons/md";

const COLORS = ["#f59e0b", "#10b981", "#ef4444", "#3b82f6"];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#f8fafc" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full animate-spin"
            style={{ border: "3px solid #e2e8f0", borderTopColor: "#3b82f6" }} />
          <p className="text-sm text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const barData = [
    { name: "Students", value: data.totalStudents || 0 },
    { name: "Applications", value: data.totalApplications || 0 },
    { name: "Documents", value: data.totalDocuments || 0 },
  ];

  const pieData = [
    { name: "Pending", value: data.pendingDocs || 0 },
    { name: "Approved", value: data.approvedDocs || 0 },
    { name: "Rejected", value: data.rejectedDocs || 0 },
  ];

  return (
    <div className="p-6 min-h-screen" style={{ background: "#f8fafc" }}>

      {/* Welcome */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#3b82f6" }}>
            ADMIN PANEL
          </p>
          <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.5px" }}>
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Full system overview and controls
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl text-sm font-bold capitalize text-white"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            boxShadow: "0 4px 15px rgba(59,130,246,0.3)"
          }}>
          {user?.role}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Students" value={data.totalStudents} icon={<MdPeople size={22} />} color="#3b82f6" bg="rgba(59,130,246,0.08)" />
        <Card title="Applications" value={data.totalApplications} icon={<MdDescription size={22} />} color="#10b981" bg="rgba(16,185,129,0.08)" />
        <Card title="Documents" value={data.totalDocuments} icon={<MdFolder size={22} />} color="#8b5cf6" bg="rgba(139,92,246,0.08)" />
        <Card title="Pending Docs" value={data.pendingDocs} icon={<MdPendingActions size={22} />} color="#f59e0b" bg="rgba(245,158,11,0.08)" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-6"
          style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 20px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }} />
            <h2 className="font-bold text-gray-800">System Overview</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}
                fill="url(#blueGradient)" />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6"
          style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 20px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }} />
            <h2 className="font-bold text-gray-800">Document Status</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={45}
                dataKey="value"
                paddingAngle={3}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ fontSize: "12px", color: "#64748b" }}>{value}</span>}
              />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6"
        style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 20px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }} />
          <h2 className="font-bold text-gray-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction label="Manage Users" icon={<MdManageAccounts size={24} />} link="/admin/users" color="#3b82f6" bg="rgba(59,130,246,0.08)" navigate={navigate} />
          <QuickAction label="Students" icon={<MdSchool size={24} />} link="/admin/students" color="#10b981" bg="rgba(16,185,129,0.08)" navigate={navigate} />
          <QuickAction label="Applications" icon={<MdDescription size={24} />} link="/admin/applications" color="#8b5cf6" bg="rgba(139,92,246,0.08)" navigate={navigate} />
          <QuickAction label="Customers" icon={<MdBusiness size={24} />} link="/admin/customers" color="#f59e0b" bg="rgba(245,158,11,0.08)" navigate={navigate} />
        </div>
      </div>

    </div>
  );
};

const Card = ({ title, value, icon, color, bg }) => (
  <div className="bg-white rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
    style={{
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 1px 20px rgba(0,0,0,0.04)",
      cursor: "pointer"
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 20px rgba(0,0,0,0.04)"}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: bg, color: color }}>
        {icon}
      </div>
    </div>
    <p className="text-3xl font-black text-gray-900 mb-1" style={{ letterSpacing: "-1px" }}>
      {value ?? 0}
    </p>
    <p className="text-xs text-gray-500 font-medium">{title}</p>
    <div className="mt-3 h-1 rounded-full" style={{ background: bg }}>
      <div className="h-1 rounded-full w-2/3" style={{ background: color }} />
    </div>
  </div>
);

const QuickAction = ({ label, icon, link, color, bg, navigate }) => (
  <button
    onClick={() => navigate(link)}
    className="rounded-xl p-4 flex flex-col items-center gap-2 transition-all w-full font-semibold text-sm"
    style={{ background: bg, color: color }}
    onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
  >
    {icon}
    {label}
  </button>
);

export default AdminDashboard;