import api from "../../../api/axios";

export const createQuotation = async (payload) => {
  const response = await api.post("/api/quotations", payload);

  return response.data;
};

export const getQuotationByPublicId = async (publicId, params) => {
  const response = await api.get(`/api/quotations/${publicId}`, { params });

  return response.data;
};

export const getLeadOptionsForQuotation = async (params) => {
  const response = await api.get("/api/leads/options", { params });

  return response.data;
};
