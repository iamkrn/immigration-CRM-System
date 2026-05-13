import API from "./API";

const shortlistService = {
  
    getShortlist : async (studentId) => API.get(`/shortlist/${studentId}`),
    updateUniversityStatus : async(studentId, universityId, status) => API.patch(`/shortlist/${studentId}/${universityId}`, {status}),
    deleteUniversity : async(studentId, universityId) => API.delete(`/shortlist/${studentId}/${universityId}`),
    addUniversity : async(studentId,data) => API.post(`/shortlist/${studentId}`, data)

}

export default shortlistService;