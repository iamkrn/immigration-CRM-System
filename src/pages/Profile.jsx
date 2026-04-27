import { useEffect, useState } from "react";
import API from "../services/API";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("/user/profile", {
      })
    .then(res => {
      console.log(res.data),
      setUser(res.data.user);
})
    .catch(err => console.log(err));

  }, []);

    if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-pulse text-gray-500 text-lg">Loading Profile...</div>
      </div>
    );
  }


    return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 flex justify-center items-start">

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">

        {/*  HEADER */}
        <div className="flex items-center justify-between border-b pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Profile 👤
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your personal information
            </p>
          </div>

          <div className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold capitalize">
            {user.role}
          </div>
        </div>

        {/*  BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Info label="First Name" value={user.name} />
        
          <Info label="Email" value={user.email} />

        </div>

        {/*  ROLE BASED UI */}

        {/*  STUDENT */}
        {user.role === "student" && (
  <div className="mt-8 border-t pt-6">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">
      Student Details
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <Info label="Preferred Country" value={user.studentData?.preferredCountry || "-"} />
      
      <Info label="Qualification" value={user.studentData?.qualification || "-"} />
      
      <Info label="City" value={user.studentData?.city || "-"} />
      
      <Info label="State" value={user.studentData?.state || "-"} />
      
      <Info label="Country" value={user.studentData?.country || "-"} />
      
      <Info label="Phone" value={user.studentData?.phone || "-"} />
      
      <Info label="Father Name" value={user.studentData?.fatherName || "-"} />
      
      <Info label="Mother Name" value={user.studentData?.motherName || "-"} />

    </div>
  </div>
)}
        {/*COUNSELLOR */}
        {user.role === "counsellor" && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Counsellor Info
            </h2>

            <p className="text-gray-600">
              You manage students & applications.
            </p>
          </div>
        )}

        {/* ADMIN */}
        {user.role === "admin" && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Admin Panel Access
            </h2>

            <p className="text-gray-600">
              Full system control enabled.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

/*  REUSABLE COMPONENT */
const Info = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg border">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800 mt-1">{value}</p>
  </div>
);


export default Profile;