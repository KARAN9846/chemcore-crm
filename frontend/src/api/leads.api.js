import api from "./axios";

export const createLead = async (payload) => {
  const response = await api.post("/leads", payload);

  return response.data;
};

export const getLeads = async (params) => {
  const response = await api.get("/leads", { params });

  return response.data;
};

export const getLeadByPublicId = async (publicId, params) => {
  const response = await api.get(`/leads/${publicId}`, { params });

  return response.data;
};

export const updateLead = async (publicId, payload) => {
  const response = await api.patch(`/leads/${publicId}`, payload);

  return response.data;
};

export const updateLeadFollowup = async (publicId, payload) => {
  const response = await api.patch(`/leads/${publicId}/follow-up`, payload);

  return response.data;
};

export const deleteLead = async (publicId, params) => {
  const response = await api.delete(`/leads/${publicId}`, { params });

  return response.data;
};
