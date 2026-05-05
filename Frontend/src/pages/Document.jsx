import React, { useState, useEffect } from 'react';
import API from '../services/API';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdAdd, MdDelete, MdCheckCircle,
  MdCancel, MdVisibility, MdDownload, MdFolder
} from "react-icons/md";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000"

const Document = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase();

  useEffect(() => { fetchDocs(); }, [applicationId]);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/documents/${applicationId}`);
      setDocs(res.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await API.delete(`/documents/${id}`);
      fetchDocs();
    } catch (error) {
      alert('Delete failed');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/documents/${id}/status`, { status });
      fetchDocs();
    } catch (error) {
      alert("Status update failed");
    }
  };

  const statusConfig = {
    approved: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
    rejected: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
    pending: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  };
    const handleDownload = async (fileURL, fileName) => {
    const res  = await fetch(`${BASE_URL}/${fileURL}`);
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };



  return (
    <div className="p-6 min-h-screen" style={{ background: "#f8fafc" }}>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#3b82f6" }}>
            DOCUMENTS
          </p>
          <h2 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.5px" }}>
            Application Documents
          </h2>
        </div>

        {(role === "student" || role === "counsellor" || role === "admin" || role === "superAdmin") && (
          <button
            onClick={() => navigate(`/add-document/${applicationId}`)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              boxShadow: "0 4px 15px rgba(59,130,246,0.3)"
            }}
          >
            <MdAdd size={18} />
            Add Document
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: docs.length, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
          { label: "Approved", value: docs.filter(d => d.status === "approved").length, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
          { label: "Pending", value: docs.filter(d => d.status === "pending").length, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4"
            style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 20px rgba(0,0,0,0.04)" }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 20px rgba(0,0,0,0.04)" }}>

        <div className="px-6 py-4 border-b flex items-center gap-2"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <MdFolder size={20} style={{ color: "#3b82f6" }} />
          <h2 className="font-bold text-gray-800">Documents List</h2>
        </div>

        <table className="w-full text-sm">
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              {["#", "Name", "Type", "Status", "Actions"].map(h => (
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
                <td colSpan="5" className="text-center p-10">
                  <div className="w-8 h-8 rounded-full animate-spin mx-auto"
                    style={{ border: "3px solid #e2e8f0", borderTopColor: "#3b82f6" }} />
                </td>
              </tr>
            ) : docs.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-10 text-gray-400">
                  <MdFolder size={40} className="mx-auto mb-2 opacity-30" />
                  No Documents Found
                </td>
              </tr>
            ) : (
              docs.map((d, i) => (
                <tr key={d._id}
                  className="border-t transition-all"
                  style={{ borderColor: "rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <td className="p-4 text-xs font-semibold text-gray-400">{i + 1}</td>

                  <td className="p-4 font-semibold text-gray-800">{d.name}</td>

                  <td className="p-4">
                    <span className="px-2 py-1 rounded-lg text-xs font-semibold capitalize"
                      style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
                      {d.type}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="flex items-center gap-1.5 w-fit px-2 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: statusConfig[d.status]?.bg || "rgba(0,0,0,0.05)",
                        color: statusConfig[d.status]?.color || "#64748b"
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full"
                        style={{ background: statusConfig[d.status]?.color || "#64748b" }} />
                      {d.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2 flex-wrap">

                      {(role === "admin" || role === "counsellor" || role === "superadmin") && (
                        <>
                          {d.status !== "approved" && (
                            <button
                              onClick={() => updateStatus(d._id, "approved")}
                              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all"
                              style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.2)"}
                              onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.1)"}
                            >
                              <MdCheckCircle size={13} /> Approve
                            </button>
                          )}
                          {d.status !== "rejected" && (
                            <button
                              onClick={() => updateStatus(d._id, "rejected")}
                              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all"
                              style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(245,158,11,0.2)"}
                              onMouseLeave={e => e.currentTarget.style.background = "rgba(245,158,11,0.1)"}
                            >
                              <MdCancel size={13} /> Reject
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(d._id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                          >
                            <MdDelete size={14} />
                          </button>
                        </>
                      )}

                      <a href={`http://localhost:5000/${d.fileURL}`} target="_blank" rel="noreferrer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                        style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.2)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(59,130,246,0.1)"}
                      >
                        <MdVisibility size={14} />
                      </a>

                      <button
                      onClick={() => handleDownload(d.fileURL, d.name)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(100,116,139,0.1)", color: "#64748b" }}
                    >
                      <MdDownload size={14} />
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

export default Document;