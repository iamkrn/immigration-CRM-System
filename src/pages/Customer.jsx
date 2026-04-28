import { useEffect, useState, } from "react";
import API from "../services/API";
import { useNavigate, useOutletContext } from "react-router-dom";

function Customers() {

const context = useOutletContext();
const search = context?.search || "";
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  const filteredStudents = students.filter((s) =>
  `${s.firstName || ""} ${s.lastName || ""}`
    .toLowerCase()
    .includes(search.toLowerCase()) ||
  (s.email || "").toLowerCase().includes(search.toLowerCase())
);
  useEffect(() => {
    fetchStudents();
  }, []);
  const user = JSON.parse(localStorage.getItem("user")) || {};

const canEdit = ["admin", "counsellor", "superAdmin"].includes(user.role);
const canDelete = ["admin", "superAdmin"].includes(user.role);
const role = user?.role;


  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      if (res.data.success) {
        setStudents(res.data.data);
      }
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-customer/${id}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
       <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Total Students</h3>
          <p className="text-2xl font-bold">{students.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Active</h3>
          <p className="text-2xl font-bold text-green-600">
            {students.filter(s => s.isActive).length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Inactive</h3>
          <p className="text-2xl font-bold text-red-500">
            {students.filter(s => !s.isActive).length}
          </p>
        </div>
      </div>


      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-700">Customers</h2>

        {["counsellor", "admin", "superAdmin"].includes(role) && (
            <button
              onClick={() => navigate("/add-customer")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
            >
              + Add Customer
            </button>
          )}
        
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr><th className="p-3">#</th> 
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th></tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-400">
                  No Customers Found 😕
                </td>
              </tr>
            ) : (
              filteredStudents.map((s, index) => (
                <tr
                  key={s._id}
                  className="text-center border-t hover:bg-gray-50 transition"
                >
                  {/* Serial Number */}
                  <td className="p-3 font-semibold text-gray-500">
                    {index + 1}
                  </td>

                  <td className="p-3 font-medium text-gray-700">
{`${s.firstName || ""} ${s.lastName || ""}`}      
            </td>

                  <td className="p-3 text-gray-600">{s.email}</td>
                  <td className="p-3 text-gray-600">{s.phone}</td>

                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full font-medium text-xs ${
                            s.leadStatus === "hot"
                            ? "bg-red-100 text-red-500"
                            : s.leadStatus === "warm"
                            ? "bg-yellow-100 text-yellow-500"
                            : s.leadStatus === "cold"
                            ? "bg-blue-100 text-blue-500"
                            : "bg-green-100 text-green-500"
                          }`}
                        >
                          {s.leadStatus || "new"}
                        </span></td>

                  <td className="p-3 flex justify-center gap-2">
                     {canEdit && 
                     (<button
                      onClick={() => handleEdit(s._id)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>

                     )}
                    {canDelete && (<button
                      onClick={() => handleDelete(s._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  )}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;