import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BRANDING_API_URL = `${BASE_URL}/api/branding`;

export const saveBranding = async (companyId, payload) => {
  const response = await axios.post(
    `${BRANDING_API_URL}/${companyId}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const getBranding = async (companyId) => {
  const response = await axios.get(`${BRANDING_API_URL}/${companyId}`);
  return response.data;
};
