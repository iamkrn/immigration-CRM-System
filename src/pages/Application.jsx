import { useState } from "react"
import API from "../services/API"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";

const Application = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchApplication = async() => {
    try {
      setLoading(true);
      const res = await API.get('/applications');
      setApps(res.data.data);
    } catch (error) {
      console.log("Fetch error:", error);
      alert("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplication();
  }, []);

  const handleDelete = async(id) => {
    try {
      await API.delete(`/applications/${id}`);
      setApps(apps.filter(app => app._id !== id));
      alert("Application deleted successfully");
    } catch (error) {
      console.log("Delete error:", error);
      alert("Failed to delete application");
    }
  }

  //role based logic 

    const user = JSON.parse(localStorage.getItem("user")) || {};

  const canEdit = ["admin", "counsellor"].includes(user.role);
const canDelete = user.role === "admin";
const canAdd  = ["admin", "counsellor"].includes(user.role)
const role = user?.role;


  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-700">
          Applications
        </h2>

        {canAdd && (
          <button
          onClick={() => navigate("/add-application")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + Add Application
        </button>
      
        )}</div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">

          {/* Header */}
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Student</th>
              <th className="p-3">Country</th>
              <th className="p-3">Course</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  Loading... ⏳
                </td>
              </tr>
            ) : apps.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-400">
                  No Applications Found 😕
                </td>
              </tr>
            ) : (
              apps.map((a, index) => (
                <tr
                  key={a._id}
                  className="text-center border-t hover:bg-gray-50 transition"
                >
                  {/* Serial Number */}
                  <td className="p-3 font-semibold text-gray-500">
                    {index + 1}
                  </td>

                  {/* Student Name */}
                  <td className="p-3 font-medium text-gray-700">
                    {a.student
                      ? `${a.student.firstName || ""} ${a.student.lastName || ""}`
                      : "N/A"}
                  </td>

                  <td className="p-3 text-gray-600">{a.country}</td>
                  <td className="p-3 text-gray-600">{a.course}</td>

                  {/* Status Badge */}
                  <td className="p-3">
                    <span
  className={`px-2 py-1 rounded-full text-xs font-medium ${
    a.status === "offer_received" || a.status === "accepted" || a.status === "visa_approved"
      ? "bg-green-100 text-green-600"

      : a.status === "rejected" || a.status === "visa_rejected"
      ? "bg-red-100 text-red-600"

      : a.status === "submitted" || a.status === "under_review"
      ? "bg-blue-100 text-blue-600"

      : a.status === "documents_pending"
      ? "bg-yellow-100 text-yellow-600"

      : a.status === "visa_processing"
      ? "bg-purple-100 text-purple-600"

      : "bg-gray-100 text-gray-600"
  }`}
>
  {a.status.replaceAll("_", " ")}
</span></td>

                  {/* Actions */}
                  <td className="p-3 flex justify-center gap-2">
                    {canEdit && (
                      <button
                      onClick={() => navigate(`/edit-application/${a._id}`)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md cursor-pointer"
                    >
                      Edit
                    </button>

                    )}
                    {canDelete && (
                      <button
                      onClick={() => handleDelete(a._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md cursor-pointer"
                    >
                      Delete
                    </button>
                    
                    )}
                    <button
                      onClick={() => navigate(`/documents/${a._id}`)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer"
                    >
                      Documents
                    </button>
                    
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

export default Application