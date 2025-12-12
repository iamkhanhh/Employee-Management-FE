import { axiosInstance } from "../lib/axios";

const employeedocService = {
  // GET /documents/{id}
  getDocumentById: async (id) => {
    const res = await axiosInstance.get(`/documents/${id}`);
    return res.data;
  },

  // GET /documents
  getAllDocuments: async (params) => {
    const res = await axiosInstance.get(`/documents`, { params });
    return res;
  },

  // POST /documents
  createDocument: async (data) => {
    // Now sends a JSON payload as specified by the user
    const res = await axiosInstance.post(`/documents`, data);
    return res;
  },

  // PUT /documents/{id}
  updateDocument: async (id, data) => {
    // Now sends a JSON payload
    const res = await axiosInstance.put(`/documents/${id}`, data);
    return res;
  },

  // DELETE /documents/{id}
  deleteDocument: async (id) => {
    const res = await axiosInstance.delete(`/documents/${id}`);
    return res;
  },

  // GET /documents/{id}/download
  downloadDocument: async (id) => {
    const res = await axiosInstance.get(`/documents/${id}/download`, {
      responseType: "blob",
    });
    return res;
  },
};

export default employeedocService;
