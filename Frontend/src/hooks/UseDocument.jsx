//  State + logic outside from components— reusable aur testable 
// Concept: Custom Hook = brain of state, component = only face 

import { useState, useEffect, useCallback } from "react";
import documentService from "../services/DocumentService";

const UseDocument = (applicationId) => {
  const [docs, setDocs]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchDocs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await documentService.getAll(applicationId);
      setDocs(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const deleteDoc = async (id) => {
    await documentService.remove(id);
    setDocs(prev => prev.filter(d => d._id !== id)); // refetch ki zaroorat nahi
  };

  const updateStatus = async (id, status) => {
    await documentService.updateStatus(id, status);
    setDocs(prev => prev.map(d => d._id === id ? { ...d, status } : d)); // optimistic update
  };

  return { docs, loading, error, fetchDocs, deleteDoc, updateStatus };
};

export default UseDocument;