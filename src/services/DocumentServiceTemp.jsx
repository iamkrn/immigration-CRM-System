//  All API in one place —  do not call API directly from components, 
// call from service and service will call API

// Concept: Single Responsibility — component only work for UI, data fetch and manipulation in service

import API from "./API";

const documentService = {

  // Multiple files upload
  upload: (applicationId, type, files) => {
    const formData = new FormData();
    formData.append("application", applicationId);
    formData.append("type", type);
    files.forEach(file => formData.append("files", file)); // 'files' = backend field name
    return API.post("/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => Math.round((e.loaded * 100) / e.total) // progress %
    });
  },

  getAll:     (applicationId) => API.get(`/documents/${applicationId}`),
  remove:     (id)            => API.delete(`/documents/${id}`),
  updateStatus: (id, status)  => API.put(`/documents/${id}/status`, { status }),
};

export default documentService;