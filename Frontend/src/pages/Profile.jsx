import { useEffect, useState } from "react";
import API from "../services/API";
import ProfileMeter from "../components/ProfileMeter";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});

  const fetchProfile = () => {
    API.get("/user/profile")
      .then(res => {
        const u = res.data.user;
        setUser(u);
        setForm({
          name: u.name || "",
          phone: u.phone || "",
          preferredCountry: u.studentData?.preferredCountry || "",
          qualification: u.studentData?.qualification || "",
          city: u.studentData?.city || "",
          state: u.studentData?.state || "",
          country: u.studentData?.country || "",
          fatherName: u.studentData?.fatherName || "",
          motherName: u.studentData?.motherName || "",
          dob: u.studentData?.dob || "",
          WhatsApp: u.studentData?.WhatsApp || "",
          address: u.studentData?.address || "",
          education: u.studentData?.education || "",
          passingYear: u.studentData?.passingYear || "",
          intakeYear: u.studentData?.intakeYear || "",
          visaType: u.studentData?.visaType || "",
          ieltsScore: u.studentData?.ieltsScore || "",
          toeflScore: u.studentData?.toeflScore || "",
          pteScore: u.studentData?.pteScore || "",
          courseMajor: u.studentData?.courseMajor || "",
          nationality: u.studentData?.nationality || "",
          schoolName: u.studentData?.schoolName || "",

        });
      })
      .catch(err => console.log(err));
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await API.put("/user/profile", form);
      await fetchProfile();
      setEditMode(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-pulse text-gray-500 text-lg">
          Loading Profile...
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen p-6 flex justify-center items-start" style={{ background: "#f8fafc" }}>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Profile 👤</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your personal information</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold capitalize">
              {user.role}
            </div>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {editMode ? (
            <>
              <Field label="Name" name="name" value={form.name} onChange={handleChange} />
              <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            </>
          ) : (
            <>
              <Info label="Name" value={user.name} />
              <Info label="Email" value={user.email} />

              <Info label="Phone" value={user.phone || "-"} />
            </>
          )}
        </div>

        {/* STUDENT SECTION */}
        {user.role === "student" && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Student Details
            </h2>

            {/* PROFILE COMPLETION BAR */}
            <ProfileMeter studentData={user.studentData} />
            {/* FIELDS */}
            {editMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Preferred Country" name="preferredCountry" value={form.preferredCountry} onChange={handleChange} />
                <Field label="Qualification" name="qualification" value={form.qualification} onChange={handleChange} />
                <Field label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
                <Field label="WhatsApp" name="WhatsApp" value={form.WhatsApp} onChange={handleChange} />
                <Field label="Father Name" name="fatherName" value={form.fatherName} onChange={handleChange} />
                <Field label="Mother Name" name="motherName" value={form.motherName} onChange={handleChange} />
                <Field label="Address" name="address" value={form.address} onChange={handleChange} />
                <Field label="City" name="city" value={form.city} onChange={handleChange} />
                <Field label="State" name="state" value={form.state} onChange={handleChange} />
                <Field label="Country" name="country" value={form.country} onChange={handleChange} />
                {/* Academic Section */}
                <div className="col-span-2 mt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Academic Info
                  </p>
                </div>
                <Field label="Education Level" name="education"            value={form.education}     onChange={handleChange} />
                <Field label="Qualification / Degree" name="qualification" value={form.qualification} onChange={handleChange} />
                <Field label="Passing Year" name="passingYear"             value={form.passingYear}   onChange={handleChange} />
                <Field label="School Name" name="schoolName"               value={form.schoolName}    onChange={handleChange} />
                <Field label="Nationality" name="nationality"              value={form.nationality}   onChange={handleChange} />

                {/* Exam Scores */}
                <div className="col-span-2 mt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
Exam Scores
                  </p>
                </div>
                <Field label="IELTS Score" name="ieltsScore" value={form.ieltsScore} onChange={handleChange} />
                <Field label="TOEFL Score" name="toeflScore" value={form.toeflScore} onChange={handleChange} />
                <Field label="PTE Score" name="pteScore"     value={form.pteScore}   onChange={handleChange} />

                {/* Preferences */}
                <div className="col-span-2 mt-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Course Preferences
                  </p>
                </div>
                <Field label="Preferred Country" name="preferredCountry" value={form.preferredCountry} onChange={handleChange} />
                <Field label="Course Major" name="courseMajor"           value={form.courseMajor}      onChange={handleChange} />
                <Field label="Intake Year" name="intakeYear"             value={form.intakeYear}       onChange={handleChange} />
                <Field label="Visa Type" name="visaType"                 value={form.visaType}         onChange={handleChange} />
                </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info label="Preferred Country"  value={user.studentData?.preferredCountry || "-"} />
                <Info label="Qualification"      value={user.studentData?.qualification || "-"} />
                <Info label="Date of Birth"      value={user.studentData?.dob || "-"} />
                <Info label="WhatsApp"           value={user.studentData?.WhatsApp || "-"} />
                <Info label="Father Name"        value={user.studentData?.fatherName || "-"} />
                <Info label="Mother Name"        value={user.studentData?.motherName || "-"} />
                <Info label="Address"            value={user.studentData?.address || "-"} />
                <Info label="City"               value={user.studentData?.city || "-"} />
                <Info label="State"              value={user.studentData?.state || "-"} />
                <Info label="Country"            value={user.studentData?.country || "-"} />
              
                <Info label="Education Level"    value={user.studentData?.education    || "-"} />
                <Info label="Passing Year"       value={user.studentData?.passingYear   || "-"} />
                <Info label="School Name"        value={user.studentData?.schoolName    || "-"} />
                <Info label="Nationality"        value={user.studentData?.nationality   || "-"} />
                <Info label="IELTS Score"        value={user.studentData?.ieltsScore    || "-"} />
                <Info label="TOEFL Score"        value={user.studentData?.toeflScore    || "-"} />
                <Info label="PTE Score"          value={user.studentData?.pteScore      || "-"} />
                <Info label="Course Major"       value={user.studentData?.courseMajor   || "-"} />
                <Info label="Intake Year"        value={user.studentData?.intakeYear    || "-"} />
                <Info label="Visa Type"          value={user.studentData?.visaType      || "-"} />
              </div>
            )}
          </div>
        )}

        {/* COUNSELLOR */}
        {user.role === "counsellor" && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Counsellor Info
            </h2>
            <p className="text-gray-600">You manage students & applications.</p>
          </div>
        )}

        {/* ADMIN / SUPERADMIN */}
        {(user.role === "admin" || user.role === "superAdmin") && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Admin Panel Access
            </h2>
            <p className="text-gray-600">Full system control enabled.</p>
          </div>
        )}

        {/* SAVE BUTTON */}
        {editMode && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "💾 Save Changes"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

const Info = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg border">
    <p className="text-sm text-gray-500">           {label}</p>
    <p className="font-semibold text-gray-800 mt-1">{value}</p>
  </div>
);

const Field = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-500 font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default Profile;