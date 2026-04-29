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

      {/* Stats */}
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Students 👨‍🎓</h2>
          <span className="text-sm text-gray-400">
            {students.length} total
          </span>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-left">Lead Status</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Profile</th>

            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-8 text-gray-400">
                  No Students Found 😕
                </td>
              </tr>
            ) : (
              students.map((s, index) => (
                <tr
                  key={s._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-gray-500 font-semibold">
                    {index + 1}
                  </td>

                  {/* Avatar + Name */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${s.firstName}+${s.lastName}&background=random`}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-medium text-gray-800">
                        {s.firstName || ""} {s.lastName || ""}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 text-gray-600">{s.email || "-"}</td>
                  <td className="p-3 text-gray-600">{s.phone || "-"}</td>
                  <td className="p-3 text-gray-600">{s.preferredCountry || "-"}</td>

                  {/* Lead Status */}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      s.leadStatus === "hot"
                        ? "bg-red-100 text-red-500"
                        : s.leadStatus === "warm"
                        ? "bg-yellow-100 text-yellow-600"
                        : s.leadStatus === "cold"
                        ? "bg-blue-100 text-blue-500"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {s.leadStatus || "new"}
                    </span>
                  </td>

                  {/* SKU */}
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    s.sku === "superPremium"
                      ? "bg-yellow-100 text-yellow-600"
                      : s.sku === "premium"
                      ? "bg-purple-100 text-purple-600"
                      : s.sku === "value+"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {s.sku === "superPremium" ? "💎 Super Premium"
                      : s.sku === "premium" ? "⭐ Premium"
                      : s.sku === "value+" ? "✅ Value+"
                      : "🔵 Alliance"}
                  </span>
                </td>
                    {/**profile completion */}
                  <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              s.profileCompletion >= 80
                                ? "bg-green-500"
                                : s.profileCompletion >= 50
                                ? "bg-yellow-500"
                                : "bg-red-400"
                            }`}
                            style={{ width: `${s.profileCompletion || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-semibold">
                          {s.profileCompletion || 0}%
                        </span>
                      </div>
                    </td>

                  {/* Active Status */}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      s.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}>
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;