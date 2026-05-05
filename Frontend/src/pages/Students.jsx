import React, { useEffect, useState } from "react";
import API from "../services/API";
import { MdPeople, MdCheckCircle, MdCancel, MdSchool } from "react-icons/md";

const skuConfig = {
  superPremium: { label: "💎 Super Premium", bg: "rgba(245,158,11,0.1)", color: "#d97706" },
  premium: { label: "⭐ Premium", bg: "rgba(139,92,246,0.1)", color: "#8b5cf6" },
  "value+": { label: "✅ Value+", bg: "rgba(59,130,246,0.1)", color: "#3b82f6" },
  alliance: { label: "🔵 Alliance", bg: "rgba(100,116,139,0.1)", color: "#64748b" },
};

const leadConfig = {
  hot: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
  warm: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  cold: { bg: "rgba(59,130,246,0.1)", color: "#3b82f6" },
  new: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
};

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 min-h-screen" style={{ background: "#f8fafc" }}>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Students", value: students.length, icon: <MdPeople size={20} />, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
          { label: "Active", value: students.filter(s => s.isActive).length, icon: <MdCheckCircle size={20} />, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
          { label: "Inactive", value: students.filter(s => !s.isActive).length, icon: <MdCancel size={20} />, color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4"
            style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 20px rgba(0,0,0,0.04)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 20px rgba(0,0,0,0.04)" }}>

        <div className="px-6 py-4 border-b flex justify-between items-center"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2">
            <MdSchool size={20} style={{ color: "#3b82f6" }} />
            <h2 className="font-bold text-gray-800">All Students</h2>
          </div>
          <span className="text-xs px-3 py-1 rounded-full font-semibold"
            style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>
            {students.length} total
          </span>
        </div>

        <table className="w-full text-sm">
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              {["#", "Student", "Email", "Phone", "Country", "Lead", "SKU", "Profile", "Status"].map(h => (
                <th key={h} className="p-4 text-left text-xs font-semibold uppercase"
                  style={{ color: "#94a3b8", letterSpacing: "0.5px" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-10 text-gray-400">
                  <MdPeople size={40} className="mx-auto mb-2 opacity-30" />
                  No Students Found
                </td>
              </tr>
            ) : (
              students.map((s, index) => (
                <tr key={s._id}
                  className="border-t transition-all"
                  style={{ borderColor: "rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <td className="p-4 text-xs font-semibold text-gray-400">{index + 1}</td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                        {s.firstName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">
                        {s.firstName || ""} {s.lastName || ""}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-gray-500 text-xs">{s.email || "-"}</td>
                  <td className="p-4 text-gray-500 text-xs">{s.phone || "-"}</td>
                  <td className="p-4 text-gray-500 text-xs">{s.preferredCountry || "-"}</td>

                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                      style={{
                        background: leadConfig[s.leadStatus]?.bg || "rgba(0,0,0,0.05)",
                        color: leadConfig[s.leadStatus]?.color || "#64748b"
                      }}>
                      {s.leadStatus || "new"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: skuConfig[s.sku]?.bg || "rgba(0,0,0,0.05)",
                        color: skuConfig[s.sku]?.color || "#64748b"
                      }}>
                      {skuConfig[s.sku]?.label || "Alliance"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full"
                          style={{
                            width: `${s.profileCompletion || 0}%`,
                            background: s.profileCompletion >= 80 ? "#10b981"
                              : s.profileCompletion >= 50 ? "#f59e0b" : "#ef4444"
                          }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-500">
                        {s.profileCompletion || 0}%
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="flex items-center gap-1.5 w-fit px-2 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: s.isActive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                        color: s.isActive ? "#10b981" : "#ef4444"
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full"
                        style={{ background: s.isActive ? "#10b981" : "#ef4444" }} />
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