const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
const trimLeadingSlash = (value = "") => value.replace(/^\/+/, "");
const DEFAULT_API_ORIGIN = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://chemcore-backend.onrender.com";

export const API_ORIGIN = trimTrailingSlash(
  import.meta.env.VITE_API_URL || DEFAULT_API_ORIGIN,
);

export const API_BASE_URL = `${API_ORIGIN}/api`;

export const buildApiUrl = (path = "") => {
  const cleanPath = trimLeadingSlash(path).replace(/^api\//, "");

  return cleanPath ? `${API_BASE_URL}/${cleanPath}` : API_BASE_URL;
};
