import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const BRANDING_API_URL = `${API_BASE_URL}/branding`;

export const saveBranding = async (companyId, payload) => {
  const response = await axios.post(
    `${BRANDING_API_URL}/${companyId}`,
    payload,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const getBranding = async (companyId) => {
  const response = await axios.get(`${BRANDING_API_URL}/${companyId}`, {
    withCredentials: true,
  });
  return response.data;
};
