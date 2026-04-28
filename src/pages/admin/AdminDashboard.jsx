import { useEffect, useState } from "react";
import API from "../../services/API";

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

  return (
    <div className="p-8">

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
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
      </div>

    </div>
  );
};

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

export default AdminDashboard;