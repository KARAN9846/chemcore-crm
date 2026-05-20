import axios from "./axios";

export const getCompany = async (companyId) => {
  const res = await axios.get(`/company/${companyId}`);
  return res.data;
};

export const getBranding = async (companyId) => {
  const res = await axios.get(`/branding/${companyId}`);
  return res.data;
};

export const getTeam = async (companyId) => {
  const res = await axios.get(`/team/${companyId}`);
  return res.data;
};

export const getChemicals = async (companyId) => {
  const res = await axios.get(`/chemicals/${companyId}`);
  return res.data;
};

export const getSupplier = async (companyId) => {
  const res = await axios.get(`/supplier/${companyId}`);
  return res.data;
};
