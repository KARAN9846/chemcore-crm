export const getCompanyId = () => {
  return localStorage.getItem("companyId");
};

export const clearCompanyId = () => {
  localStorage.removeItem("companyId");
};
