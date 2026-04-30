import axios from "./axios";

export const createSupplier = async (companyId, payload) => {
  try {
    const res = await axios.post(`/api/supplier/${companyId}`, payload);

    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to create supplier",
    };
  }
};
