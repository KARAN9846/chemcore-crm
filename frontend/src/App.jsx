import AppRoutes from "./routes/AppRoutes";
import { OnboardingProvider } from "./context/OnboardingContext";
import { ToastProvider } from "./components/common/ToastProvider";

function App() {
  return (
    <ToastProvider>
      <OnboardingProvider>
        <AppRoutes />
      </OnboardingProvider>
    </ToastProvider>
  );
}

export default App;
