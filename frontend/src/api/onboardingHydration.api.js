import axios from "./axios";

export const getCompany = async (companyId) => {
  const res = await axios.get(`/api/company/${companyId}`);
  return res.data;
};

export const getBranding = async (companyId) => {
  const res = await axios.get(`/api/branding/${companyId}`);
  return res.data;
};

export const getTeam = async (companyId) => {
  const res = await axios.get(`/api/team/${companyId}`);
  return res.data;
};

export const getChemicals = async (companyId) => {
  const res = await axios.get(`/api/chemicals/${companyId}`);
  return res.data;
};

export const getSupplier = async (companyId) => {
  const res = await axios.get(`/api/supplier/${companyId}`);
  return res.data;
};
