import axios from "./axios";

export const saveChemicals = async (companyId, chemicals) => {
  const res = await axios.post(`/api/chemicals/${companyId}`, { chemicals });
  return res.data;
};
