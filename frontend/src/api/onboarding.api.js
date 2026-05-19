import axios from "./axios";

export const getOnboardingStatus = async (companyId) => {
  const res = await axios.get(`/api/onboarding/status/${companyId}`);
  return res.data;
};

export const advanceOnboardingStep = async (companyId, step) => {
  const res = await axios.patch(`/api/onboarding/step/${companyId}`, { step });
  return res.data;
};

export const completeOnboarding = async (companyId) => {
  const res = await axios.post(`/api/onboarding/complete/${companyId}`);
  return res.data;
};
