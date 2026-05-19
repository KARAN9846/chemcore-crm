import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { getLeadByPublicId } from "../../api/leads.api";
import LeadActivityDrawer from "../../features/leads/components/activity/LeadActivityDrawer";
import LeadActivityTimeline from "../../features/leads/components/activity/LeadActivityTimeline";
import LeadActionHeader from "../../features/leads/components/detail/LeadActionHeader";
import LeadEmptyState from "../../features/leads/components/detail/LeadEmptyState";
import LeadFollowupSidebar from "../../features/leads/components/detail/LeadFollowupSidebar";
import LeadHero from "../../features/leads/components/detail/LeadHero";
import LeadInfoCard from "../../features/leads/components/detail/LeadInfoCard";
import LeadLoadingState from "../../features/leads/components/detail/LeadLoadingState";
import LeadQuotationsSidebar from "../../features/leads/components/detail/LeadQuotationsSidebar";
import LeadScoreSidebar from "../../features/leads/components/detail/LeadScoreSidebar";
import LeadStagePipeline from "../../features/leads/components/detail/LeadStagePipeline";
import LeadStatsSidebar from "../../features/leads/components/detail/LeadStatsSidebar";
import { getCompanyId } from "../../utils/company";
import { showSuccess } from "../../utils/toast";

const LeadDetailPage = () => {
  const { publicId } = useParams();
  const { state } = useLocation();
  const [lead, setLead] = useState(state?.createdLead ?? null);
  const [activities, setActivities] = useState([]);
  const [activityRefreshKey, setActivityRefreshKey] = useState(0);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!state?.createdLead);
  const [error, setError] = useState("");
  const companyId = getCompanyId();

  const loadLead = useCallback(async ({ showLoading = true } = {}) => {
    if (!companyId) {
      setError("Company ID missing. Please complete onboarding first.");
      setIsLoading(false);
      return;
    }

    if (showLoading) {
      setIsLoading(true);
    }
    setError("");

    try {
      const response = await getLeadByPublicId(publicId, { companyId });
      setLead(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load lead details right now",
      );
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, [companyId, publicId]);

  useEffect(() => {
    let isMounted = true;

    const loadInitialLead = async () => {
      if (isMounted) {
        await loadLead();
      }
    };

    loadInitialLead();

    return () => {
      isMounted = false;
    };
  }, [loadLead]);

  const handleActivityCreated = useCallback((activity, message) => {
    setIsActivityDrawerOpen(false);
    showSuccess(message || "Conversation saved successfully");
    setActivityRefreshKey((current) => current + 1);
    loadLead({ showLoading: false });
  }, [loadLead]);

  if (isLoading) {
    return <LeadLoadingState />;
  }

  if (error || !lead) {
    return <LeadEmptyState message={error || "Lead not found"} />;
  }

  return (
    <div className="lead-detail-page lead-detail-command-center">
      <LeadActionHeader
        lead={lead}
        onLogConversation={() => setIsActivityDrawerOpen(true)}
      />
      <LeadHero
        lead={lead}
        onLogConversation={() => setIsActivityDrawerOpen(true)}
      />

      <div className="lead-detail-grid">
        <main className="lead-detail-main" aria-label="Lead detail content">
          <LeadStagePipeline status={lead.currentStage || lead.status} />
          <LeadInfoCard lead={lead} />
          <LeadActivityTimeline
            companyId={companyId}
            publicId={publicId}
            refreshKey={activityRefreshKey}
            onActivitiesChange={setActivities}
          />
        </main>

        <aside className="lead-detail-sidebar" aria-label="Lead CRM sidebar">
          <LeadScoreSidebar lead={lead} />
          <LeadFollowupSidebar lead={lead} />
          <LeadStatsSidebar lead={lead} />
          <LeadQuotationsSidebar lead={lead} />
        </aside>
      </div>

      <LeadActivityDrawer
        activities={activities}
        companyId={companyId}
        isOpen={isActivityDrawerOpen}
        lead={lead}
        onActivityCreated={handleActivityCreated}
        onClose={() => setIsActivityDrawerOpen(false)}
      />
    </div>
  );
};

export default LeadDetailPage;
