export const saveBranding = async ({ companyId, payload }) => {
  let response;

  try {
    response = await fetch(
      `http://localhost:5000/api/onboarding/branding/${companyId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
  } catch (error) {
    const networkError = new Error(
      "Network error. Please check your internet connection.",
    );
    networkError.response = null;
    networkError.cause = error;
    throw networkError;
  }

  const data = await response.json();

  if (!response.ok) {
    const requestError = new Error(
      data.message || data.error || "Something went wrong. Please try again.",
    );
    requestError.response = {
      status: response.status,
      data,
    };
    throw requestError;
  }

  return data;
};
