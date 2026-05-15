import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from '../services/API';


const CATEGORIES = [
  { key: "knowledge",     label: "University & Course Knowledge", icon: "🎓" },
  { key: "communication", label: "Communication & Response Time",  icon: "💬" },
  { key: "support",       label: "Document & SOP Support",         icon: "🤝" },
];

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <button key={star} type="button" onClick={() => onChange(star)}>
        <span className="text-2xl transition-all"
          style={{ color: star <= value ? "#f59e0b" : "#d1d5db" }}>
          ★
        </span>
      </button>
    ))}
  </div>
);

const Feedback = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [app,        setApp]        = useState(null);
  const [existing,   setExisting]   = useState(null);
  const [ratings,    setRatings]    = useState({ knowledge: 0, communication: 0, support: 0 });
  const [comment,    setComment]    = useState("");
  const [loading,    setLoading]    = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  useEffect(() => {
    // Load application
    API.get(`/applications/${applicationId}`)
      .then(res => setApp(res.data.data))
      .catch(err => console.error(err));

    // Check existing feedback
    API.get(`/feedback/application/${applicationId}`)
      .then(res => {
        if (res.data.data) setExisting(res.data.data);
      })
      .catch(err => console.error(err));
  }, [applicationId]);

  const handleSubmit = async () => {
    if (!ratings.knowledge || !ratings.communication || !ratings.support) {
      return alert("Please rate all 3 categories");
    }
    setLoading(true);
    try {
      await API.post('/feedback', {
        applicationId,
        counsellorId: app.createdBy,
        ratings,
        comment
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  const overall = ratings.knowledge && ratings.communication && ratings.support
    ? ((ratings.knowledge + ratings.communication + ratings.support) / 3).toFixed(1)
    : null;

  if (!app) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  // Already submitted
  if (existing || submitted) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6">
      <div className="text-6xl">🌟</div>
      <h2 className="text-2xl font-bold text-gray-800">Thank you for your feedback!</h2>
      <p className="text-gray-500">Your rating has been submitted successfully.</p>
      {existing && (
        <div className="bg-white rounded-2xl p-6 border text-center mt-2">
          <p className="text-4xl font-black text-yellow-500">{existing.overallRating} ★</p>
          <p className="text-sm text-gray-400 mt-1">Your overall rating</p>
          {existing.comment && (
            <p className="text-sm text-gray-600 mt-3 italic">"{existing.comment}"</p>
          )}
        </div>
      )}
      <button onClick={() => navigate(-1)}
        className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: "#3b82f6" }}>
        ← Go Back
      </button>
    </div>
  );

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
        ← Back
      </button>

      <h1 className="text-2xl font-black text-gray-900 mb-1">⭐ Rate Your Counsellor</h1>
      <p className="text-sm text-gray-500 mb-6">
        {app.university} — {app.country}
      </p>

      {/* Overall preview */}
      {overall && (
        <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-center border border-yellow-100">
          <p className="text-3xl font-black text-yellow-500">{overall} ★</p>
          <p className="text-xs text-yellow-700 mt-1">Overall Rating Preview</p>
        </div>
      )}

      {/* Category ratings */}
      <div className="flex flex-col gap-4 mb-6">
        {CATEGORIES.map(cat => (
          <div key={cat.key} className="bg-white rounded-xl p-4 border">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {cat.icon} {cat.label}
            </p>
            <StarRating
              value={ratings[cat.key]}
              onChange={val => setRatings({ ...ratings, [cat.key]: val })}
            />
            <p className="text-xs text-gray-400 mt-1">
              {ratings[cat.key] ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][ratings[cat.key]] : "Click to rate"}
            </p>
          </div>
        ))}
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          💬 Additional Comments (optional)
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your experience with the counsellor..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition"
        style={{ background: "#f59e0b" }}
      >
        {loading ? "Submitting..." : "⭐ Submit Rating"}
      </button>
    </div>
  );
};

export default Feedback;