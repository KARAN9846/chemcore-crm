import api from "../../../api/axios";

export const getLeadActivities = async (publicId, params) => {
  const response = await api.get(`/api/leads/${publicId}/activities`, {
    params,
  });

  return response.data;
};

export const createLeadActivity = async (publicId, payload) => {
  const response = await api.post(`/api/leads/${publicId}/activities`, payload);

  return response.data;
};
