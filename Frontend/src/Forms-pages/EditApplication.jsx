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
    status: "draft",
    visaStatus: "not_started", 
    offerLetter: "",
    offerStatus: "pending",
    acceptanceDeadline: "",
    depositPaid: false,
    tuitionFeePaid: false,
    interviewDate: "",
    preDepartureNotes: "",

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

  //  VALID VISA STATUS FLOW
  const visaStatusOptions = [
    "not_started",
    "doc_pending",
    "submitted",
    "processing",
    "approved",
    "rejected",
    "withdrawn"
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
        status: res.data.data.status || "draft",
        visaStatus: res.data.data.visaStatus || "not_started",
        offerLetter: res.data.data.offerLetter || "",
        offerStatus: res.data.data.offerStatus || "pending",
        acceptanceDeadline: res.data.data.acceptanceDeadline?.slice(0,10) || "",
        depositPaid: res.data.data.depositPaid || false,
        tuitionFeePaid: res.data.data.tuitionFeePaid || false,
        interviewDate: res.data.data.interviewDate?.slice(0,10) || "",
        preDepartureNotes: res.data.data.preDepartureNotes || "",     

      });

    }  catch (error) {
      const msg =  error.response?.data?.message || "Failed to fetch application data";
      if(error.response?.status === 403){
        navigate(appsRoute);
      }else{
        alert(msg);
      }
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
          <div>
            <h2 className="font-semibold mb-3 text-grey-600 text-lg">
              Visa Status
              </h2>
              <select
              name="visaStatus"
              value={form.visaStatus}
              onChange={handleChange}
              className="input w-full"
              >
                {visaStatusOptions.map((s)=>(
                  <option key={s} value ={s}>
                    {s.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
          </div>
          {/* ── OFFER MANAGEMENT ── */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">
              🎓 Offer Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500 font-medium">Offer Letter URL</label>
                <input
                  name="offerLetter"
                  value={form.offerLetter}
                  onChange={handleChange}
                  placeholder="https://university.com/offer.pdf"
                  className="input"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500 font-medium">Offer Status</label>
                <select name="offerStatus" value={form.offerStatus} onChange={handleChange} className="input">
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500 font-medium">Acceptance Deadline</label>
                <input
                  type="date"
                  name="acceptanceDeadline"
                  value={form.acceptanceDeadline}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="flex flex-col gap-3 justify-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.depositPaid}
                    onChange={e => setForm({...form, depositPaid: e.target.checked})}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-sm text-gray-600 font-medium">Deposit Paid</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.tuitionFeePaid}
                    onChange={e => setForm({...form, tuitionFeePaid: e.target.checked})}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-sm text-gray-600 font-medium">Tuition Fee Paid</span>
                </label>
              </div>

            </div>
          </div>
          {/* ── VISA PREPARATION ── */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">
              🛂 Visa Preparation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500 font-medium">Interview Date</label>
                <input
                  type="date"
                  name="interviewDate"
                  value={form.interviewDate}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm text-gray-500 font-medium">Pre-Departure Notes</label>
                <textarea
                  name="preDepartureNotes"
                  value={form.preDepartureNotes}
                  onChange={handleChange}
                  placeholder="Flight details, accommodation, important docs to carry..."
                  rows={3}
                  className="input resize-none"
                />
              </div>

            </div>
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