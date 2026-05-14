import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/API";

const CHECKLIST_ITEMS = [
  "Valid Passport (6 months+)",
  "Visa Application Form",
  "Offer Letter from University",
  "Financial Documents (Bank Statements)",
  "IELTS/TOEFL Score Card",
  "Academic Transcripts",
  "SOP (Statement of Purpose)",
  "Letters of Recommendation",
  "Passport Size Photos",
  "Medical Insurance",
  "Biometrics Appointment",
  "Visa Fee Payment Receipt",
];

const VisaChecklist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [checked, setChecked] = useState({});

  useEffect(() => {
    API.get(`/applications/${id}`)
      .then(res => {
        setApp(res.data.data);
        // load saved checklist
        const saved = {};
        res.data.data.visaChecklist?.forEach(c => {
          saved[c.item] = c.completed;
        });
        setChecked(saved);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleToggle = async (item) => {
    const newChecked = { ...checked, [item]: !checked[item] };
    setChecked(newChecked);

    // save to backend
    const visaChecklist = CHECKLIST_ITEMS.map(i => ({
      item: i,
      completed: newChecked[i] || false
    }));
    await API.put(`/applications/${id}`, { visaChecklist });
  };

  const done = Object.values(checked).filter(Boolean).length;
  const total = CHECKLIST_ITEMS.length;
  const pct = Math.round((done / total) * 100);

  if (!app) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* Header */}
      <button onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
        ← Back
      </button>

      <h1 className="text-2xl font-black text-gray-900 mb-1">🛂 Visa Checklist</h1>
      <p className="text-sm text-gray-500 mb-6">
        {app.university} — {app.country}
      </p>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-5 mb-6 border">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold"
            style={{ color: pct === 100 ? "#10b981" : "#3b82f6" }}>
            {done}/{total} — {pct}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div className="h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: pct === 100 ? "#10b981" : "#3b82f6" }} />
        </div>
        {pct === 100 && (
          <p className="text-green-600 text-sm font-semibold mt-2">
             All documents ready!
          </p>
        )}
      </div>

      {/* Interview Date */}
      {app.interviewDate && (
        <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
          <p className="text-sm font-semibold text-blue-700">
            🗓 Interview Date: {new Date(app.interviewDate).toLocaleDateString('en-IN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
      )}

      {/* Pre Departure Notes */}
      {app.preDepartureNotes && (
        <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-100">
          <p className="text-xs font-semibold text-yellow-700 mb-1">📋 Counsellor Notes</p>
          <p className="text-sm text-gray-700">{app.preDepartureNotes}</p>
        </div>
      )}

      {/* Checklist */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {CHECKLIST_ITEMS.map((item, i) => (
          <div key={item}
            onClick={() => handleToggle(item)}
            className="flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-all hover:bg-gray-50"
            style={{ borderTop: i > 0 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
              style={{
                background: checked[item] ? "#10b981" : "white",
                border: checked[item] ? "none" : "2px solid #d1d5db"
              }}>
              {checked[item] && <span className="text-white text-xs">✓</span>}
            </div>
            <span className="text-sm text-gray-700"
              style={{ textDecoration: checked[item] ? "line-through" : "none",
                       color: checked[item] ? "#9ca3af" : "#374151" }}>
              {item}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default VisaChecklist;