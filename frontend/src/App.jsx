import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { OnboardingProvider } from "./context/OnboardingContext";

function App() {
  return (
    <OnboardingProvider>
      <AppRoutes />
      <Toaster position="top-right" />
    </OnboardingProvider>
  );
}

export default App;
