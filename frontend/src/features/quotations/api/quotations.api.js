import api from "../../../api/axios";

export const createQuotation = async (payload) => {
  const response = await api.post("/quotations", payload);

  return response.data;
};

export const reviseQuotation = async (publicId, payload) => {
  const response = await api.post(`/quotations/${publicId}/revise`, payload);

  return response.data;
};

export const getQuotations = async (params) => {
  const response = await api.get("/quotations", { params });

  return response.data;
};

export const getQuotationByPublicId = async (publicId, params) => {
  const response = await api.get(`/quotations/${publicId}`, { params });

  return response.data;
};

export const getQuotationVersions = async (publicId, params) => {
  const response = await api.get(`/quotations/${publicId}/versions`, { params });

  return response.data;
};

export const compareQuotationVersions = async (publicId, params) => {
  const response = await api.get(`/quotations/${publicId}/compare`, { params });

  return response.data;
};

export const deleteQuotation = async (publicId, params) => {
  const response = await api.delete(`/quotations/${publicId}`, { params });

  return response.data;
};

export const getLeadOptionsForQuotation = async (params) => {
  const response = await api.get("/leads/options", { params });

  return response.data;
};
