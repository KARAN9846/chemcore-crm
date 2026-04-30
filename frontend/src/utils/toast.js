import toast from "react-hot-toast";

export const showSuccess = (message) => {
  toast.success(message);
};

export const showError = (message) => {
  toast.error(message);
};

export const showLoading = (message) => {
  return toast.loading(message);
};

export const updateToast = (id, message, type = "success") => {
  if (type === "success") toast.success(message, { id });
  else toast.error(message, { id });
};
