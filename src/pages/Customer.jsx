import { useEffect, useState } from "react";
import API from "../services/API";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  MdPersonAdd, MdEdit, MdDelete,
  MdPeople, MdCheckCircle, MdCancel
} from "react-icons/md";

function Customers() {
  const context = useOutletContext();
  const search = context?.search || "";
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const canEdit = ["admin", "counsellor", "superAdmin"].includes(user.role);
  const canDelete = ["admin", "superAdmin"].includes(user.role);
  const role = user?.role;

  const filteredStudents = students.filter((s) =>
    `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase().includes(search.toLowerCase()) ||
    (s.email || "").toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      if (res.data.success) setStudents(res.data.data);
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <div className="p-6 min-h-screen" style={{ background: "#f8fafc" }}>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Customers", value: students.length, icon: <MdPeople size={20} />, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
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

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#3b82f6" }}>
            CUSTOMERS
          </p>
          <h2 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.5px" }}>
            All Customers
          </h2>
        </div>

        {["counsellor", "admin", "superAdmin"].includes(role) && (
          <button
            onClick={() => navigate("/add-customer")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              boxShadow: "0 4px 15px rgba(59,130,246,0.3)"
            }}
          >
            <MdPersonAdd size={18} />
            Add Customer
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 20px rgba(0,0,0,0.04)" }}>

        <table className="w-full text-sm">
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              {["#", "Name", "Email", "Phone", "Lead", "SKU", "Profile", "Actions"].map(h => (
                <th key={h} className="p-4 text-left text-xs font-semibold uppercase"
                  style={{ color: "#94a3b8", letterSpacing: "0.5px" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-10 text-gray-400">
                  <MdPeople size={40} className="mx-auto mb-2 opacity-30" />
                  No Customers Found
                </td>
              </tr>
            ) : (
              filteredStudents.map((s, index) => (
                <tr key={s._id}
                  className="border-t transition-all"
                  style={{ borderColor: "rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <td className="p-4 text-xs font-semibold text-gray-400">{index + 1}</td>

                  {/* Name + Avatar */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                        {s.firstName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">
                        {`${s.firstName || ""} ${s.lastName || ""}`}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-gray-500 text-xs">{s.email}</td>
                  <td className="p-4 text-gray-500 text-xs">{s.phone || "-"}</td>

                  {/* Lead Status */}
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                      style={{
                        background: leadConfig[s.leadStatus]?.bg || "rgba(0,0,0,0.05)",
                        color: leadConfig[s.leadStatus]?.color || "#64748b"
                      }}>
                      {s.leadStatus || "new"}
                    </span>
                  </td>

                  {/* SKU */}
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: skuConfig[s.sku]?.bg || "rgba(0,0,0,0.05)",
                        color: skuConfig[s.sku]?.color || "#64748b"
                      }}>
                      {skuConfig[s.sku]?.label || "Alliance"}
                    </span>
                  </td>

                  {/* Profile Completion */}
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

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {canEdit && (
                        <button
                          onClick={() => navigate(`/edit-customer/${s._id}`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(245,158,11,0.2)"}
                          onMouseLeave={e => e.currentTarget.style.background = "rgba(245,158,11,0.1)"}
                        >
                          <MdEdit size={15} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                          onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                        >
                          <MdDelete size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;