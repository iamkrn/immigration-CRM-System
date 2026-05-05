//  Multiple files + preview + validation + progress — production ready

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import documentService from "../services/DocumentService";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE_MB   = 5;

const AddDocument = () => {
  const { applicationId } = useParams();
  const navigate          = useNavigate();

  const [type,     setType]     = useState("");
  const [files,    setFiles]    = useState([]);   // Array — multiple files
  const [progress, setProgress] = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState([]);

  // Validate each file before storing
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const invalid  = [];
    const valid    = [];

    selected.forEach(f => {
      if (!ALLOWED_TYPES.includes(f.type)) {
        invalid.push(`${f.name} — Only PDF/JPG/PNG allowed`);
      } else if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        invalid.push(`${f.name} — Max ${MAX_SIZE_MB}MB allowed`);
      } else {
        valid.push(f);
      }
    });

    setErrors(invalid);
    setFiles(valid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || files.length === 0) return alert("Select type and files");

    try {
      setLoading(true);
      await documentService.upload(applicationId, type, files, (p) => setProgress(p));
      navigate(`/documents/${applicationId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Documents</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Document Type */}
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="border p-3 rounded-lg w-full"
          >
            <option value="">Select Document Type</option>
            {["sop","lor","passport","financial","academics","other"].map(t => (
              <option key={t} value={t}>{t.toUpperCase()}</option>
            ))}
          </select>

          {/* Multiple File Input */}
          <input
            type="file"
            multiple                          // ← KEY FIX
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="border p-3 rounded-lg w-full"
          />

          {/* Validation Errors */}
          {errors.map((e, i) => (
            <p key={i} className="text-red-500 text-sm">{e}</p>
          ))}

          {/* File Preview List */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((f, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
                  <span className="font-medium text-gray-700">{f.name}</span>
                  <span className="text-gray-400">{(f.size / 1024).toFixed(1)} KB</span>
                  {/* Remove individual file */}
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                    className="text-red-400 hover:text-red-600 text-xs"
                  >Remove</button>
                </div>
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">{progress}%</p>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate(-1)}
              className="px-5 py-2 border rounded-lg text-gray-600">Cancel</button>
            <button type="submit" disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50">
              {loading ? `Uploading ${progress}%...` : `Upload ${files.length} File(s)`}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddDocument;