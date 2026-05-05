import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/API";

const EditApplication = () => {

  const [form, setForm] = useState({
    country: "",
    university: "",
    course: "",
    intake: "",
    student: "",
    status: "draft"
  });

  const { id } = useParams();

  const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const appsRoute = ["admin", "superAdmin"].includes(user?.role) 
      ? "/admin/applications" 
      : "/applications";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  //  VALID STATUS FLOW
  const statusOptions = [
    "draft",
    "documents_pending",
    "submitted",
    "under_review",
    "offer_received",
    "accepted",
    "rejected",
    "visa_processing",
    "visa_approved",
    "visa_rejected"
  ];

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.student || !form.university || !form.course || !form.country || !form.intake) {
      return alert("All fields required");
    }

    try {
      setLoading(true);
      await API.put(`/applications/${id}`, form);
      alert("Application updated");
      navigate(appsRoute);
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    fetchData();
    fetchStudents();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await API.get(`/applications/${id}`);

      setForm({
        country: res.data.data.country || "",
        university: res.data.data.university || "",
        course: res.data.data.course || "",
        intake: res.data.data.intake || "",
        student: res.data.data.student?._id || "",
        status: res.data.data.status || "draft"
      });

    }  catch (error) {
  console.log("Error:", error.response?.data);
  alert(error.response?.data?.message || "Failed to load application");

    }
    finally {
      setFetchingData(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl text-gray-600">Loading... ⏳</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl p-8">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Edit Application
        </h1>

        <form onSubmit={handleUpdate} className="space-y-6">

          {/* Student */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">
              Student Info
            </h2>

            <select
              name="student"
              value={form.student}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.firstName} {s.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Application */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">
              Application Info
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                name="university"
                value={form.university}
                onChange={handleChange}
                placeholder="University"
                className="input"
                required
              />

              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="Course"
                className="input"
                required
              />

              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
                className="input"
                required
              />

              <select
                name="intake"
                value={form.intake}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Intake</option>
                <option value="Jan">January</option>
                <option value="May">May</option>
                <option value="Sep">September</option>
              </select>

            </div>
          </div>

          {/*  FIXED STATUS */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">
              Status
            </h2>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input w-full"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={() => navigate("/applications")}
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Update Application"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditApplication;