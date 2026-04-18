import React, { useEffect, useState } from "react";
import API from "../services/API";
import StatsChart from "../components/StatsChart";

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

  if (!data) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-4">
        Welcome {user?.name} 👋
      </h1>

      <p className="text-gray-600 mb-6">
        Role: <span className="font-semibold">{role}</span>
      </p>

      {/*  CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {/* Admin */}
        {role === "admin" && (
          <>
            <Card title="Students" value={data.totalStudents} color="bg-blue-500" />
            <Card title="Applications" value={data.totalApplications} color="bg-green-500" />
            <Card title="Documents" value={data.totalDocuments} color="bg-purple-500" />
          </>
        )}

        {/* Counsellor */}
        {role === "counsellor" && (
          <>
            <Card title="Applications" value={data.totalApplications} color="bg-green-500" />
            <Card title="Pending Docs" value={data.pendingDocs} color="bg-yellow-500" />
          </>
        )}

        {/* Student */}
        {role === "student" && (
          <>
            <Card title="My Documents" value={data.totalDocuments} color="bg-purple-500" />
            <Card title="Pending" value={data.pendingDocs} color="bg-yellow-500" />
          </>
        )}

      </div>

      {/*  CHART */}
      {(role === "admin" || role === "counsellor") && (
        <StatsChart data={data} />
      )}

    </div>
  );
};

const Card = ({ title, value, color }) => {
  return (
    <div className={`${color} text-white p-5 rounded-xl shadow`}>
      <h2 className="text-sm">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default Dashboard;