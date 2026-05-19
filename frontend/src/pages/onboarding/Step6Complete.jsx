import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/layout/TopBar";
import CompleteHeader from "../../components/onboarding/complete/CompleteHeader";
import QuickActions from "../../components/onboarding/complete/QuickActions";
import SetupSummary from "../../components/onboarding/complete/SetupSummary";
import WorkspaceUrl from "../../components/onboarding/complete/WorkspaceUrl";
import ProgressBar from "../../components/onboarding/layout/ProgressBar";
import { completeOnboarding } from "../../api/onboarding.api";
import { getCompanyId } from "../../utils/company";
import { clearOnboardingStorage } from "../../utils/onboardingStorage";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Step6Complete = () => {
  const navigate = useNavigate();
  const companyId = getCompanyId();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!companyId) {
        setLoading(false);
        clearOnboardingStorage();
        return;
      }

      try {
        console.log("ACTIVE COMPANY ID:", getCompanyId());
        const res = await fetch(`${API_BASE}/api/onboarding/summary/${companyId}`);
        const data = await res.json();

        if (data.success) {
          setSummary(data.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
        clearOnboardingStorage();
      }
    };

    fetchSummary();
  }, [companyId]);

  const goToDashboard = async () => {
    const activeCompanyId = getCompanyId();

    if (!activeCompanyId || completing) {
      return;
    }

    try {
      setCompleting(true);
      await completeOnboarding(activeCompanyId);
      clearOnboardingStorage();
      navigate("/dashboard");
    } catch (error) {
      console.error("Completion error:", error);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return <div>Loading setup summary...</div>;
  }

  const safeSummary = summary || {
    company: null,
    branding: null,
    teamCount: 0,
    chemicals: [],
    supplier: null,
  };
  const chemicals = safeSummary.chemicals || [];

  return (
    <div className="step6">
      <TopBar variant="secure" />
      <ProgressBar currentStep={6} />

      <div className="main-wrap">
        <div className="complete-card">
          <CompleteHeader
            company={safeSummary.company}
            teamCount={safeSummary.teamCount}
            chemicalsCount={chemicals.length}
          />

          <SetupSummary
            company={safeSummary.company}
            branding={safeSummary.branding}
            teamCount={safeSummary.teamCount}
            chemicals={chemicals}
            supplier={safeSummary.supplier}
          />

          <QuickActions navigate={navigate} />

          <button
            type="button"
            onClick={goToDashboard}
            className="btn-dashboard"
            disabled={completing}
          >
            <i className="bi bi-speedometer2"></i>{" "}
            {completing ? "Finishing..." : "Go to Dashboard"}
          </button>

          <WorkspaceUrl branding={safeSummary.branding} />
        </div>
      </div>
    </div>
  );
};

export default Step6Complete;
