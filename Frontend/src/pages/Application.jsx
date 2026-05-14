import { useState, useEffect } from "react";
import API from "../services/API";
import { useNavigate } from "react-router-dom";
import {
  MdAdd, MdEdit, MdDelete,
  MdDescription, MdFolder
} from "react-icons/md";



const statusConfig = {
  draft: { bg: "rgba(100,116,139,0.1)", color: "#64748b" },
  documents_pending: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  submitted: { bg: "rgba(59,130,246,0.1)", color: "#3b82f6" },
  under_review: { bg: "rgba(99,102,241,0.1)", color: "#6366f1" },
  offer_received: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
  accepted: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
  rejected: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
  visa_processing: { bg: "rgba(139,92,246,0.1)", color: "#8b5cf6" },
  visa_approved: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
  visa_rejected: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
};

const Application = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = ["admin", "superAdmin"].includes(user?.role);

  const canEdit = ["admin", "counsellor", "superAdmin"].includes(user.role);
  const canDelete = ["admin", "superAdmin"].includes(user.role);
  const canAdd = ["admin", "counsellor", "superAdmin"].includes(user.role);

  useEffect(() => { fetchApplication(); }, []);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const res = await API.get('/applications');
      setApps(res.data.data);
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await API.delete(`/applications/${id}`);
      setApps(apps.filter(app => app._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete");
    }
  };

  // Stats
  const total = apps.length;
  const approved = apps.filter(a => ["accepted", "visa_approved", "offer_received"].includes(a.status)).length;
  const pending = apps.filter(a => ["draft", "documents_pending", "submitted", "under_review"].includes(a.status)).length;

  return (
    <div className="p-6 min-h-screen" style={{ background: "#f8fafc" }}>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Applications", value: total, icon: <MdDescription size={20} />, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
          { label: "Approved", value: approved, icon: <MdDescription size={20} />, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
          { label: "Pending", value: pending, icon: <MdDescription size={20} />, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
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
            APPLICATIONS
          </p>
          <h2 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.5px" }}>
            All Applications
          </h2>
        </div>

        {canAdd && (
          <button
            onClick={() => navigate(isAdmin ? "/admin/add-application" : "/add-application")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              boxShadow: "0 4px 15px rgba(59,130,246,0.3)"
            }}
          >
            <MdAdd size={18} />
            Add Application
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 20px rgba(0,0,0,0.04)" }}>

        <table className="w-full text-sm">
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              {["#", "Student", "University", "Country", "Course", "Status", "offer", "visa", "Actions"].map(h => (
                <th key={h} className="p-4 text-left text-xs font-semibold uppercase"
                  style={{ color: "#94a3b8", letterSpacing: "0.5px" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-10">
                  <div className="w-8 h-8 rounded-full animate-spin mx-auto"
                    style={{ border: "3px solid #e2e8f0", borderTopColor: "#3b82f6" }} />
                </td>
              </tr>
            ) : apps.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-10 text-gray-400">
                  <MdDescription size={40} className="mx-auto mb-2 opacity-30" />
                  No Applications Found
                </td>
              </tr>
            ) : (
              apps.map((a, index) => (
                <tr key={a._id}
                  className="border-t transition-all"
                  style={{ borderColor: "rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <td className="p-4 text-xs font-semibold text-gray-400">{index + 1}</td>

                  {/* Student */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                        {a.student?.firstName?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <span className="font-semibold text-gray-800">
                        {a.student
                          ? `${a.student.firstName || ""} ${a.student.lastName || ""}`
                          : "N/A"}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-gray-500 text-xs">{a.university || "-"}</td>
                  <td className="p-4 text-gray-500 text-xs">{a.country}</td>
                  <td className="p-4 text-gray-500 text-xs">{a.course}</td>

                  {/* Status */}
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                      style={{
                        background: statusConfig[a.status]?.bg || "rgba(0,0,0,0.05)",
                        color: statusConfig[a.status]?.color || "#64748b"
                      }}>
                      {a.status?.replaceAll("_", " ")}
                    </span>
                  </td>

                  {/* Offer*/}
                <td className="p-4">
                  {a.offerLetter ? (
                    <div className="flex flex-col gap-1">
                      
                        <a href={a.offerLetter}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold px-2 py-1 rounded-lg text-center"
                        style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}
                      >
                        📄 View Offer
                      </a>
                      {a.acceptanceDeadline && (
                        <p className="text-xs text-gray-400 text-center">
                          Due: {new Date(a.acceptanceDeadline).toLocaleDateString()}
                        </p>
                      )}
                      {/* Student Accept/Reject buttons */}
                      {user.role === "student" && a.offerStatus === "pending" && (
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={async () => {
                              await API.put(`/applications/${a._id}`, { offerStatus: "accepted" });
                              fetchApplication();
                            }}
                            className="flex-1 text-xs py-1 rounded font-semibold"
                            style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}
                          >
                            ✓ Accept
                          </button>
                          <button
                            onClick={async () => {
                              await API.put(`/applications/${a._id}`, { offerStatus: "rejected" });
                              fetchApplication();
                            }}
                            className="flex-1 text-xs py-1 rounded font-semibold"
                            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                          >
                            ✗ Reject
                          </button>
                        </div>
                      )}
                      {a.offerStatus !== "pending" && (
                        <span className="text-xs font-semibold text-center capitalize"
                          style={{ color: a.offerStatus === "accepted" ? "#10b981" : "#ef4444" }}>
                          {a.offerStatus}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300">No offer</span>
                  )}
                </td>
                {/* Visa Column */}
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    {/* Visa Status Badge */}
                    <span className="text-xs font-semibold px-2 py-1 rounded-full text-center capitalize"
                      style={{
                        background: a.visaStatus === "approved" ? "rgba(16,185,129,0.1)"
                          : a.visaStatus === "rejected" ? "rgba(239,68,68,0.1)"
                          : a.visaStatus === "submitted" ? "rgba(59,130,246,0.1)"
                          : "rgba(100,116,139,0.1)",
                        color: a.visaStatus === "approved" ? "#10b981"
                          : a.visaStatus === "rejected" ? "#ef4444"
                          : a.visaStatus === "submitted" ? "#3b82f6"
                          : "#64748b"
                      }}>
                      {a.visaStatus?.replaceAll("_", " ") || "not started"}
                    </span>

                    {/* Interview Date */}
                    {a.interviewDate && (
                      <p className="text-xs text-gray-500 text-center">
                        🗓 {new Date(a.interviewDate).toLocaleDateString()}
                      </p>
                    )}

                    {/* Pre Departure Notes */}
                    {a.preDepartureNotes && user.role === "student" && (
                      <p className="text-xs text-blue-500 text-center"
                        title={a.preDepartureNotes}>
                        📋 Guidance available
                      </p>
                    )}
                  </div>
                </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {canEdit && (
                        <button
                          onClick={() => navigate(isAdmin ? `/admin/edit-application/${a._id}` : `/edit-application/${a._id}`)}
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
                          onClick={() => handleDelete(a._id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                          onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                        >
                          <MdDelete size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/documents/${a._id}`)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.2)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.1)"}
                      >
                        <MdFolder size={15} />
                      </button>
                      {/* Visa Checklist Button */}
                    <button
                      onClick={() => navigate(`/visa-checklist/${a._id}`)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}
                      title="Visa Checklist"
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.2)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.1)"}
                    >
                      🛂
                    </button>
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
};

export default Application;