import React, { useState,useEffect } from 'react'
import API from '../services/API';
import {useNavigate, useParams} from 'react-router-dom'

const Document = () => {
  const  [docs,setDocs] = useState([]);
  const {applicationId} = useParams();
   const navigate = useNavigate();

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
    return (
    <div className="p-6 bg-gray-50 min-h-screen ">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-700">
          Documents
        </h2>

        <button
          onClick={() => navigate(`/add-document/${applicationId}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + Add Documents
        </button>
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
                  <td className="p-3">{d.name}</td>
                  <td className="p-3">{d.type}</td>
                  <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${d.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : d.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"}
                        `}>
                          {d.status}
                        </span>
                      </td>
                  <td className="p-3 flex justify-center gap-3">

                      {/*  Delete */}
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm shadow"
                      >
                        Delete
                      </button>

                      {/*  View */}
                      <a
                        href={`http://localhost:5000/${d.fileURL}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm shadow"
                      >
                        View
                      </a>

                      {/* Download */}
                      <a
                        href={`http://localhost:5000/${d.fileURL}`}
                        download
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm shadow"
                      >
                        Download
                      </a>

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

export default Document
