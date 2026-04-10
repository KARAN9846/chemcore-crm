import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);

const TOAST_TIMEOUT_MS = 4000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const activeToastsRef = useRef(new Set());

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    activeToastsRef.current.delete(id);
  }, []);

  const showToast = useCallback(
    ({ type = "info", message }) => {
      const id = `${type}:${message}`;

      if (activeToastsRef.current.has(id)) {
        return;
      }

      activeToastsRef.current.add(id);

      setToasts((prev) => [...prev, { id, type, message }]);

      window.setTimeout(() => {
        dismissToast(id);
      }, TOAST_TIMEOUT_MS);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className={`app-toast app-toast-${toast.type}`}>
            <div className="app-toast-body">{toast.message}</div>
            <button
              type="button"
              className="app-toast-close"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
