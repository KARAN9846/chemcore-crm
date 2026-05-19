import { BrowserRouter, Routes, Route } from "react-router-dom";
import OnboardingStart from "../pages/onboarding/OnboardingStart";
import Step1Company from "../pages/onboarding/Step1Company";
import Step2Branding from "../pages/onboarding/Step2Branding";
import Step3TeamInvite from "../pages/onboarding/Step3TeamInvite";
import Step4Chemicals from "../pages/onboarding/Step4Chemicals";
import Step5Supplier from "../pages/onboarding/Step5Supplier";
import Step6Complete from "../pages/onboarding/Step6Complete";
import DashboardLayout from "../layouts/DashboardLayout";
import AddLeadPage from "../pages/dashboard/AddLeadPage";
import CompliancePage from "../pages/dashboard/CompliancePage";
import DashboardHome from "../pages/dashboard/DashboardHome";
import LeadDetailPage from "../pages/dashboard/LeadDetailPage";
import LeadEditPage from "../pages/dashboard/LeadEditPage";
import LeadFollowupPage from "../pages/dashboard/LeadFollowupPage";
import LeadsPage from "../pages/dashboard/LeadsPage";
import OrdersPage from "../pages/dashboard/OrdersPage";
import PaymentsPage from "../pages/dashboard/PaymentsPage";
import PurchaseOrdersPage from "../pages/dashboard/PurchaseOrdersPage";
import CreateQuotationPage from "../features/quotations/pages/CreateQuotationPage";
import QuotationDetailPage from "../pages/dashboard/QuotationDetailPage";
import QuotationsPage from "../pages/dashboard/QuotationsPage";
import ReportsPage from "../pages/dashboard/ReportsPage";
import SettingsPage from "../pages/dashboard/SettingsPage";
import ShipmentsPage from "../pages/dashboard/ShipmentsPage";
import SuppliersPage from "../pages/dashboard/SuppliersPage";
import OnboardingErrorBoundary from "./OnboardingErrorBoundary";
import OnboardingGuard from "./OnboardingGuard";

const withOnboardingBoundary = (element) => (
  <OnboardingErrorBoundary>{element}</OnboardingErrorBoundary>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingStart />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="leads/new" element={<AddLeadPage />} />
          <Route path="leads/:publicId/follow-up" element={<LeadFollowupPage />} />
          <Route path="leads/:publicId/edit" element={<LeadEditPage />} />
          <Route path="leads/:publicId" element={<LeadDetailPage />} />
          <Route path="quotations" element={<QuotationsPage />} />
          <Route path="quotations/new" element={<CreateQuotationPage />} />
          <Route path="quotations/:publicId" element={<QuotationDetailPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="shipments" element={<ShipmentsPage />} />
          <Route path="compliance" element={<CompliancePage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route
          path="/onboarding/step1"
          element={withOnboardingBoundary(
            <OnboardingGuard step={1}>
              <Step1Company />
            </OnboardingGuard>,
          )}
        />
        <Route
          path="/onboarding/step2"
          element={withOnboardingBoundary(
            <OnboardingGuard step={2}>
              <Step2Branding />
            </OnboardingGuard>,
          )}
        />
        <Route
          path="/onboarding/step3"
          element={withOnboardingBoundary(
            <OnboardingGuard step={3}>
              <Step3TeamInvite />
            </OnboardingGuard>,
          )}
        />
        <Route
          path="/onboarding/step4"
          element={withOnboardingBoundary(
            <OnboardingGuard step={4}>
              <Step4Chemicals />
            </OnboardingGuard>,
          )}
        />
        <Route
          path="/onboarding/step5"
          element={withOnboardingBoundary(
            <OnboardingGuard step={5}>
              <Step5Supplier />
            </OnboardingGuard>,
          )}
        />
        <Route
          path="/onboarding/step6"
          element={withOnboardingBoundary(
            <OnboardingGuard step={6}>
              <Step6Complete />
            </OnboardingGuard>,
          )}
        />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
