import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/API";

const AddDocument = () => {
  const navigate = useNavigate();
  const {applicationId} = useParams();
  const [loading,setLoading] = useState(false);
  const  [form,setForm] = useState({
    name:"",
    type:"",
    file:null
  })

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })

  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.type || !form.file) {
    alert("required all fields");
    return;
  }

  const formData = new FormData();
  formData.append('name',form.name)
  formData.append('file',form.file)
  formData.append('application',applicationId)
  formData.append('type',form.type)

  try {
    setLoading(true);

    await API.post("/documents",formData, {
      headers:{
        "Content-Type": "multipart/form-data"
            }
    });

    navigate(`/documents/${applicationId}`);

  } catch (error) {
    console.log(error);
    alert("something went wrong");
  } finally {
    setLoading(false);
  }
}; return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Add Document
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 🔹 Document Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-600 mb-3">
              Document Info
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Document Name (Passport, SOP...)"
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input 
              type="file"
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"

              onChange={(e)=>setForm({
                ...form,
               file: e.target.files[0]
               
              })}/>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="border p-2 rounded"
                >
                <option value="">Select Type</option>
                <option value="sop">SOP</option>
                <option value="lor">LOR</option>
                <option value="passport">Passport</option>
                <option value="financial">Financial</option>
                <option value="academics">Academics</option>
                <option value="other">Other</option>
                </select>
            </div>
          </div>

          {/* 🔘 Buttons */}
          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow"
            >
              {loading ? "Saving..." : "Save Document"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );}

export default AddDocument