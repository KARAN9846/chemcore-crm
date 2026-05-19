import toast from "react-hot-toast";

const toastOptions = {
  duration: 3500,
};

export const showSuccess = (message) => {
  toast.success(message, toastOptions);
};

export const showError = (message) => {
  toast.error(message, { ...toastOptions, duration: 4500 });
};

export const showWarning = (message) => {
  toast(message, {
    ...toastOptions,
    duration: 5000,
    icon: "!",
    style: {
      border: "1px solid rgba(201, 168, 76, 0.28)",
      background: "#fffdf5",
      color: "#6f5620",
      fontWeight: 600,
    },
  });
};

export const showValidationWarning = (message) => {
  showWarning(message);
};

export const showLoading = (message) => {
  return toast.loading(message);
};

export const updateToast = (id, message, type = "success") => {
  if (type === "success") toast.success(message, { id });
  else toast.error(message, { id });
};
