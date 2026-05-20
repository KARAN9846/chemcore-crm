import api from "../../../api/axios";

export const createQuotation = async (payload) => {
  const response = await api.post("/quotations", payload);

  return response.data;
};

export const getQuotationByPublicId = async (publicId, params) => {
  const response = await api.get(`/quotations/${publicId}`, { params });

  return response.data;
};

export const getLeadOptionsForQuotation = async (params) => {
  const response = await api.get("/leads/options", { params });

  return response.data;
};
