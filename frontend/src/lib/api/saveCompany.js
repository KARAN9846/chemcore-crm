export const saveCompany = async ({ url, method, body }) => {
  let response;

  try {
    response = await fetch(url, {
      method,
      body,
    });
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
