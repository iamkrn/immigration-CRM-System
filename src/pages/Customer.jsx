import { useEffect, useState, useRef } from "react";
import API from "../services/API";
import { useNavigate } from "react-router-dom";

function Customers() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");

      console.log("DATA:", res.data);

      if (res.data.success) {
        setStudents(res.data.data);
      }

    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customers</h2>

        <button
          onClick={() => navigate("/add-customer")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Customer
        </button>
      </div>

      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="4">No Data</td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s._id} className="text-center border-t">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.phone}</td>
                <td className="p-2">Active</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;