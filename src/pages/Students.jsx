import React, { useEffect, useState } from "react";
import API from "../services/API";

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* 🔥 TOP STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Total Students</h3>
          <p className="text-2xl font-bold">{students.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Active</h3>
          <p className="text-2xl font-bold text-green-600">
            {students.filter(s => s.isActive).length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Inactive</h3>
          <p className="text-2xl font-bold text-red-500">
            {students.filter(s => !s.isActive).length}
          </p>
        </div>
      </div>

      {/* 🔥 TABLE CARD */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Students 👨‍🎓</h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr
                key={s._id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* NAME + AVATAR */}
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${s.name}`}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{s.name}</span>
                </td>

                {/* EMAIL */}
                <td className="p-3 text-gray-600">{s.email}</td>

                {/* ROLE BADGE */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold
                    ${
                      s.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : s.role === "counsellor"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {s.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Students;