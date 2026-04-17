import React, { useState,useEffect } from 'react'
import API from '../services/API';
import {useNavigate, useParams} from 'react-router-dom'

const Document = () => {
  const  [docs,setDocs] = useState([]);
  const {applicationId} = useParams();
   const navigate = useNavigate();
  
   const user = JSON.parse(localStorage.getItem("user"));
   const role = user?.role?.toLowerCase();

   if (!user) {
  return <div>Please login again</div>;
}


  useEffect(() => {
    fetchDocs();
  }, [])
  

  const fetchDocs = async() => {
    try {
      const res = await API.get(`/documents/${applicationId}`)
      setDocs(res.data.data)
    
    } catch (error) {
      console.log(error)
    }}

    const handleDelete = async(id) => {
        if (!window.confirm("Are you sure?")) return;

      try {
            await API.delete(`/documents/${id}`);
            fetchDocs(); //refresh 

      } catch (error) {
console.log(error);
alert('Not deleted!  ')
      }    
    }

    const updateStatus = async (id, status) => {
  try {
    await API.put(`/documents/${id}/status`, { status });
    fetchDocs();
  } catch (error) {
    console.log(error);
  }
};
console.log("ROLE:", role);
    return (
    <div className="p-6 bg-gray-50 min-h-screen ">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-700">
          Documents
        </h2>

        {(role === "student" || role === "counsellor") && (
          <button
          onClick={() => navigate(`/add-document/${applicationId}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + Add Documents
        </button>
      
        )}
        </div>


      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
              
            </tr>
          </thead>

          <tbody>
            {docs.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-400">
                  No Documents Found 😕
                </td>
              </tr>
            ) : (
              docs.map((d, i) => (
                <tr key={d._id} className="border-t text-center">
                        <td className="p-3">{i + 1}</td>

                        <td className="p-3 font-medium">{d.name}</td>

                        <td className="p-3 capitalize">{d.type}</td>

                        {/* STATUS BADGE */}
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${d.status === "approved"
                                ? "bg-green-100 text-green-600"
                                : d.status === "rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-yellow-100 text-yellow-600"}
                            `}
                          >
                            {d.status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="p-3 flex flex-wrap justify-center gap-2">

                          {/* Approve / Reject */}
                          {(role === "admin" || role === "counsellor") && (
                            <>
                              <button
                                onClick={() => updateStatus(d._id, "approved")}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs shadow"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() => updateStatus(d._id, "rejected")}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs shadow"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {/* Delete */}
                          {(role === "admin" || role === "counsellor") && (
  <button
    onClick={() => handleDelete(d._id)}
    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs shadow"
  >
    Delete
  </button>
)}
                          {/*  View */}
                          <a
                            href={`http://localhost:5000/${d.fileURL}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs shadow"
                          >
                            View
                          </a>

                          {/*  Download */}
                          <a
                            href={`http://localhost:5000/${d.fileURL}`}
                            download
                            className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded-lg text-xs shadow"
                          >
                            Download
                          </a>

                        </td>
                      </tr>))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Document
