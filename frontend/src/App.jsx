import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { OnboardingProvider } from "./context/OnboardingContext";

function App() {
  return (
    <OnboardingProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            border: "1px solid #e2e6ea",
            borderRadius: "12px",
            background: "#ffffff",
            color: "#0d2b1a",
            boxShadow: "0 10px 24px rgba(13, 43, 26, 0.12)",
            fontSize: "12.5px",
            fontWeight: 600,
          },
          success: {
            iconTheme: {
              primary: "#2ea66a",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#d46a7f",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </OnboardingProvider>
  );
}

export default App;
