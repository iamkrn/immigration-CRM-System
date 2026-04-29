import { useEffect, useState } from "react";
import API from "../../services/API";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    API.get("/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Bar chart data
  const barData = [
    { name: "Students", value: data.totalStudents || 0 },
    { name: "Applications", value: data.totalApplications || 0 },
    { name: "Documents", value: data.totalDocuments || 0 },
  ];

  // Pie chart data
  const pieData = [
    { name: "Pending", value: data.pendingDocs || 0 },
    { name: "Approved", value: data.approvedDocs || 0 },
    { name: "Rejected", value: data.rejectedDocs || 0 },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <Card
          title="Total Students"
          value={data.totalStudents}
          icon="👥"
          gradient="from-blue-500 to-blue-600"
        />
        <Card
          title="Applications"
          value={data.totalApplications}
          icon="📋"
          gradient="from-green-500 to-green-600"
        />
        <Card
          title="Documents"
          value={data.totalDocuments}
          icon="📄"
          gradient="from-purple-500 to-purple-600"
        />
        <Card
          title="Pending Docs"
          value={data.pendingDocs}
          icon="⏳"
          gradient="from-yellow-500 to-yellow-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            📊 Overview
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            📁 Document Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          ⚡ Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction
            label="Manage Users"
            icon="👥"
            link="/admin/users"
            color="bg-blue-50 text-blue-600 hover:bg-blue-100"
          />
          <QuickAction
            label="View Students"
            icon="🎓"
            link="/admin/students"
            color="bg-green-50 text-green-600 hover:bg-green-100"
          />
          <QuickAction
            label="Applications"
            icon="📄"
            link="/admin/applications"
            color="bg-purple-50 text-purple-600 hover:bg-purple-100"
          />
          <QuickAction
            label="Customers"
            icon="🏢"
            link="/admin/customers"
            color="bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
          />
        </div>
      </div>

    </div>
  );
};

// Card Component
const Card = ({ title, value, icon, gradient }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
    <div className={`bg-linear-to-br ${gradient} p-6 text-white`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-90 mb-2">{title}</p>
          <p className="text-4xl font-bold">{value ?? 0}</p>
        </div>
        <span className="text-5xl opacity-30">{icon}</span>
      </div>
    </div>
    <div className="px-6 py-3 bg-gray-50">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Total Count
      </p>
    </div>
  </div>
);

// Quick Action Component
const QuickAction = ({ label, icon, link, color }) => (
  <a href={link}
    className={`${color} rounded-xl p-4 flex flex-col items-center gap-2 transition font-semibold text-sm`}
  >
    <span className="text-3xl">{icon}</span>
    {label}
  </a>
);

export default AdminDashboard;