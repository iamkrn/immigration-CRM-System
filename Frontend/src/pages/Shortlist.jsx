import { useEffect, useState } from "react";
import shortlistService from "../services/shortlistService";
import API from "../services/API";

const STATUS_COLORS = {
  shortlisted:    { bg: "#EFF6FF", text: "#1D4ED8", label: "Shortlisted" },
  applied:        { bg: "#FEF9C3", text: "#854D0E", label: "Applied" },
  offer_received: { bg: "#F0FDF4", text: "#166534", label: "Offer Received" },
  rejected:       { bg: "#FEF2F2", text: "#991B1B", label: "Rejected" },
  withdrawn:      { bg: "#F9FAFB", text: "#374151", label: "Withdrawn" },
};

const Shortlist = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isStudent    = user.role === "student";
  const isCounsellor = user.role === "counsellor" || user.role === "admin" || user.role === "superAdmin";

  const [students,       setStudents]       = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [shortlist,      setShortlist]      = useState(null);
  const [loading,        setLoading]        = useState(false);

  // Add form state
  const [form, setForm] = useState({ name: "", country: "", course: "", reason: "" });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // ─── Load students list (counsellor) ───────────
  useEffect(() => {
    if (!isCounsellor) return;
    API.get("/students")
      .then(res => setStudents(res.data.data || res.data))
      .catch(err => console.error(err));
  }, []);

  // ─── Load shortlist ─────────────────────────────
  useEffect(() => {
    const studentId = isStudent ? user.studentId : selectedStudent?._id;
    if (!studentId) return;

    setLoading(true);
    shortlistService.getShortlist(studentId)
      .then(res => setShortlist(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedStudent, user.studentId]);

  // ─── Add university ─────────────────────────────
  const handleAdd = async () => {
    if (!form.name || !form.country || !form.course) return;
    const studentId = selectedStudent?._id;
    if (!studentId) return;

    setAdding(true);
    try {
      const res = await shortlistService.addUniversity(studentId, form);
      setShortlist(res.data.data);
      setForm({ name: "", country: "", course: "", reason: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  // ─── Status update ──────────────────────────────
  const handleStatus = async (universityId, status) => {
    const studentId = isStudent ? user.studentId : selectedStudent?._id;
    try {
      const res = await shortlistService.updateUniversityStatus(studentId, universityId, status);
      setShortlist(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Delete university ──────────────────────────
  const handleDelete = async (universityId) => {
    const studentId = selectedStudent?._id;
    try {
      const res = await shortlistService.removeUniversity(studentId, universityId);
      setShortlist(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const universities = shortlist?.universities || [];

  return (
    <div className="p-6" style={{ background: "#f8fafc", minHeight: "100%" }}>

      {/* ── HEADER ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🎓 University Shortlist</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isStudent ? "Universities recommended by your counsellor" : "Manage university recommendations for students"}
        </p>
      </div>

      {/* ── COUNSELLOR: Student Selector ── */}
      {isCounsellor && (
        <div className="bg-white rounded-xl border p-4 mb-6">
          <label className="text-sm font-semibold text-gray-600 block mb-2">
            Select Student
          </label>
          <select
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={e => {
              const s = students.find(st => st._id === e.target.value);
              setSelectedStudent(s || null);
              setShortlist(null);
            }}
            defaultValue=""
          >
            <option value="" disabled>-- Choose a student --</option>
            {students.map(s => (
              <option key={s._id} value={s._id}>
                {s.firstName} {s.lastName} — {s.email}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ── COUNSELLOR: Add University Button ── */}
      {isCounsellor && selectedStudent && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition"
            style={{ background: "#3b82f6" }}
          >
            {showForm ? "✕ Cancel" : "+ Add University"}
          </button>
        </div>
      )}

      {/* ── ADD FORM ── */}
      {isCounsellor && showForm && selectedStudent && (
        <div className="bg-white rounded-xl border p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Add University</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="University Name *" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
            <FormField label="Country *" value={form.country}
              onChange={e => setForm({ ...form, country: e.target.value })} />
            <FormField label="Course *" value={form.course}
              onChange={e => setForm({ ...form, course: e.target.value })} />
            <FormField label="Reason for recommendation" value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })} />
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAdd}
              disabled={adding}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: "#10b981" }}
            >
              {adding ? "Adding..." : "✓ Add to Shortlist"}
            </button>
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {loading && (
        <div className="text-center py-12 text-gray-400 text-sm">Loading shortlist...</div>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && universities.length === 0 && (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-4xl mb-3">🏫</p>
          <p className="text-gray-500 font-medium">No universities shortlisted yet</p>
          <p className="text-sm text-gray-400 mt-1">
            {isStudent ? "Your counsellor will add recommendations soon" : "Select a student and add universities above"}
          </p>
        </div>
      )}

      {/* ── UNIVERSITY CARDS ── */}
      {!loading && universities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universities.map((uni) => {
            const s = STATUS_COLORS[uni.status] || STATUS_COLORS.shortlisted;
            return (
              <div key={uni._id} className="bg-white rounded-xl border p-5 hover:shadow-md transition">

                {/* Top row */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">{uni.name}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {uni.country} &nbsp;·&nbsp; {uni.course}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: s.bg, color: s.text }}>
                    {s.label}
                  </span>
                </div>

                {/* Reason */}
                {uni.reason && (
                  <div className="bg-blue-50 rounded-lg px-3 py-2 mb-3">
                    <p className="text-xs text-blue-600 font-medium">💡 Counsellor's reason</p>
                    <p className="text-sm text-gray-700 mt-0.5">{uni.reason}</p>
                  </div>
                )}

                {/* Counsellor actions */}
                {isCounsellor && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                    <select
                      value={uni.status}
                      onChange={e => handleStatus(uni._id, e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                    >
                      <option value="shortlisted">Shortlisted</option>
                      <option value="applied">Applied</option>
                      <option value="offer_received">Offer Received</option>
                      <option value="rejected">Rejected</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                    <button
                      onClick={() => handleDelete(uni._id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      style={{ background: "#FEF2F2", color: "#DC2626" }}
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Added info */}
                <p className="text-xs text-gray-300 mt-2">
                  Added {new Date(uni.addedAt).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const FormField = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs font-medium text-gray-500 block mb-1">{label}</label>
    <input
      value={value}
      onChange={onChange}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default Shortlist;