import React, { useEffect, useState } from "react";
import API from "../services/API";

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

     
      {/*  TABLE CARD */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Students 👨‍🎓</h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Email</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr
                key={s._id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* NAME + AVATAR */}
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${s.name}`}
                    className="w-8 h-8 rounded-full"
                  />
              <span className="font-medium">
                {s.firstName} {s.lastName}
              </span>                </td>

                {/* EMAIL */}
                <td className="p-3 text-gray-600">{s.email}</td>

                {/* ROLE BADGE */}
                </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Students;