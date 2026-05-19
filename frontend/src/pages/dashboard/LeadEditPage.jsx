import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getLeadByPublicId, updateLead } from "../../api/leads.api";
import LeadStickyActionBar from "../../components/leads/common/LeadStickyActionBar";
import LeadInsightsPanel from "../../components/leads/insights/LeadInsightsPanel";
import LeadChemicalRequirementsSection from "../../components/leads/sections/LeadChemicalRequirementsSection";
import LeadContactSection from "../../components/leads/sections/LeadContactSection";
import LeadFollowupSection from "../../components/leads/sections/LeadFollowupSection";
import LeadSourceAssignmentSection from "../../components/leads/sections/LeadSourceAssignmentSection";
import LeadTradeTermsSection from "../../components/leads/sections/LeadTradeTermsSection";
import LeadEmptyState from "../../features/leads/components/detail/LeadEmptyState";
import LeadLoadingState from "../../features/leads/components/detail/LeadLoadingState";
import { initialLeadFormState } from "../../features/leads/constants/leadFormDefaults";
import {
  getLeadComplianceWarnings,
  getLeadWorkflowHints,
} from "../../features/leads/logic/leadCompliance";
import { calculateLeadScore } from "../../features/leads/logic/leadScoring";
import { mapLeadToLeadForm } from "../../features/leads/utils/leadFormMappers";
import {
  hasTouchedLeadFields,
  validateLeadForm,
} from "../../features/leads/utils/leadFormValidation";
import { getCompanyId } from "../../utils/company";
import { showError, showSuccess, showValidationWarning } from "../../utils/toast";

const MIN_SUBMIT_LOCK_MS = 1500;

const getLeadTitle = (lead) => {
  const contactName = [lead?.firstName, lead?.lastName].filter(Boolean).join(" ");

  return [contactName, lead?.companyName].filter(Boolean).join(" - ");
};

const LeadEditPage = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [leadForm, setLeadForm] = useState(() => initialLeadFormState);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const submitLockRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const loadLead = async () => {
      const companyId = getCompanyId();

      if (!companyId) {
        setPageError("Company ID missing. Please complete onboarding first.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setPageError("");

      try {
        const response = await getLeadByPublicId(publicId, { companyId });

        if (isMounted) {
          setLead(response.data);
          setLeadForm(mapLeadToLeadForm(response.data));
        }
      } catch (error) {
        if (isMounted) {
          setPageError(
            error.response?.data?.message || "Unable to load lead for editing",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLead();

    return () => {
      isMounted = false;
    };
  }, [publicId]);

  const errors = useMemo(() => {
    if (!submitAttempted && !hasTouchedLeadFields(touched)) {
      return {};
    }

    return validateLeadForm(leadForm);
  }, [leadForm, submitAttempted, touched]);

  const scorePreview = useMemo(() => calculateLeadScore(leadForm), [leadForm]);

  const compliancePreview = useMemo(
    () => getLeadComplianceWarnings(leadForm),
    [leadForm],
  );

  const workflowHints = useMemo(
    () => getLeadWorkflowHints(leadForm, scorePreview),
    [leadForm, scorePreview],
  );

  const leadFormWithDerivedValues = useMemo(
    () => ({
      ...leadForm,
      chemicalRequirements: {
        ...leadForm.chemicalRequirements,
        estimatedValue: scorePreview.estimatedValue.formatted,
      },
    }),
    [leadForm, scorePreview],
  );

  const handleInputChange = useCallback((section, field, value) => {
    setSubmitError("");
    setLeadForm((currentForm) => ({
      ...currentForm,
      [section]: {
        ...currentForm[section],
        [field]: value,
      },
    }));
  }, []);

  const handleFieldBlur = useCallback((section, field) => {
    setTouched((currentTouched) => ({
      ...currentTouched,
      [section]: {
        ...currentTouched[section],
        [field]: true,
      },
    }));
  }, []);

  const handleArrayToggle = useCallback((section, field, value) => {
    setLeadForm((currentForm) => {
      const currentValues = currentForm[section][field];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...currentForm,
        [section]: {
          ...currentForm[section],
          [field]: nextValues,
        },
      };
    });
  }, []);

  const handleChemicalToggle = useCallback(
    (chemical) => {
      handleArrayToggle("chemicalRequirements", "chemicals", chemical);
      setTouched((currentTouched) => ({
        ...currentTouched,
        chemicalRequirements: {
          ...currentTouched.chemicalRequirements,
          chemicals: true,
        },
      }));
    },
    [handleArrayToggle],
  );

  const handleTradeTermToggle = useCallback(
    (term) => {
      setLeadForm((currentForm) => ({
        ...currentForm,
        tradeTerms: {
          ...currentForm.tradeTerms,
          incoterms: currentForm.tradeTerms.incoterms.includes(term)
            ? []
            : [term],
        },
      }));
      setTouched((currentTouched) => ({
        ...currentTouched,
        tradeTerms: {
          ...currentTouched.tradeTerms,
          incoterms: true,
        },
      }));
    },
    [],
  );

  const handlePaymentTermToggle = useCallback(
    (term) => {
      handleArrayToggle("tradeTerms", "paymentTerms", term);
    },
    [handleArrayToggle],
  );

  const handleFormKeyDown = useCallback((event) => {
    if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
      event.preventDefault();
    }
  }, []);

  const handleSubmitAttempt = useCallback(async (event) => {
    event?.preventDefault();

    if (submitLockRef.current) {
      return;
    }

    setSubmitAttempted(true);

    const nextErrors = validateLeadForm(leadForm);

    if (Object.keys(nextErrors).length > 0) {
      showValidationWarning("Please fix lead details before saving");
      return;
    }

    const companyId = getCompanyId();

    if (!companyId) {
      const message = "Company ID missing. Please complete onboarding first.";
      setSubmitError(message);
      showError(message);
      return;
    }

    submitLockRef.current = true;
    const lockStartedAt = Date.now();
    setIsSaving(true);
    setSubmitError("");

    try {
      const response = await updateLead(publicId, {
        companyId,
        leadForm: leadFormWithDerivedValues,
        intelligence: {
          score: scorePreview.score,
          status: scorePreview.status,
        },
      });
      const updatedLead = response.data;
      showSuccess(response.message || "Lead updated successfully");
      navigate(`/dashboard/leads/${updatedLead.publicId}`, {
        state: { createdLead: updatedLead },
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Unable to update lead right now";
      setSubmitError(message);
      showError(message);
    } finally {
      const elapsed = Date.now() - lockStartedAt;
      const remainingLock = Math.max(0, MIN_SUBMIT_LOCK_MS - elapsed);

      window.setTimeout(() => {
        submitLockRef.current = false;
        setIsSaving(false);
      }, remainingLock);
    }
  }, [leadForm, leadFormWithDerivedValues, navigate, publicId, scorePreview]);

  if (isLoading) {
    return <LeadLoadingState />;
  }

  if (pageError || !lead) {
    return <LeadEmptyState message={pageError || "Lead not found"} />;
  }

  const leadTitle = getLeadTitle(lead);

  return (
    <div className="lead-page lead-edit-page">
      <div className="lead-breadcrumb-bar">
        <nav className="lead-breadcrumb" aria-label="Breadcrumb">
          <Link to="/dashboard/leads">
            <i className="bi bi-funnel" aria-hidden="true"></i>
            Leads
          </Link>
          <span className="lead-breadcrumb-separator">/</span>
          <Link to={`/dashboard/leads/${publicId}`}>{leadTitle}</Link>
          <span className="lead-breadcrumb-separator">/</span>
          <span>Edit</span>
        </nav>
      </div>

      <div className="lead-page-header">
        <div>
          <h2>Edit Lead</h2>
          <p>{leadTitle || "Update lead details, trade terms, and follow-up flow."}</p>
        </div>
      </div>

      {submitError ? (
        <div className="lead-submit-alert lead-submit-alert-error">
          <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
          {submitError}
        </div>
      ) : null}

      <div className="lead-workspace">
        <form
          className="lead-form"
          noValidate
          onKeyDown={handleFormKeyDown}
          onSubmit={handleSubmitAttempt}
        >
          <LeadContactSection
            data={leadForm.contact}
            errors={errors.contact}
            touched={touched.contact}
            submitAttempted={submitAttempted}
            onInputChange={handleInputChange}
            onFieldBlur={handleFieldBlur}
          />
          <LeadChemicalRequirementsSection
            data={leadFormWithDerivedValues.chemicalRequirements}
            errors={errors.chemicalRequirements}
            touched={touched.chemicalRequirements}
            submitAttempted={submitAttempted}
            onInputChange={handleInputChange}
            onFieldBlur={handleFieldBlur}
            onChemicalToggle={handleChemicalToggle}
          />
          <LeadTradeTermsSection
            data={leadForm.tradeTerms}
            errors={errors.tradeTerms}
            touched={touched.tradeTerms}
            submitAttempted={submitAttempted}
            onInputChange={handleInputChange}
            onFieldBlur={handleFieldBlur}
            onTradeTermToggle={handleTradeTermToggle}
            onPaymentTermToggle={handlePaymentTermToggle}
          />
          <LeadSourceAssignmentSection
            data={leadForm.sourceAssignment}
            errors={errors.sourceAssignment}
            touched={touched.sourceAssignment}
            submitAttempted={submitAttempted}
            onInputChange={handleInputChange}
            onFieldBlur={handleFieldBlur}
          />
          <LeadFollowupSection
            data={leadForm.followUp}
            errors={errors.followUp}
            touched={touched.followUp}
            submitAttempted={submitAttempted}
            onInputChange={handleInputChange}
            onFieldBlur={handleFieldBlur}
          />
        </form>

        <LeadInsightsPanel
          scorePreview={scorePreview}
          compliancePreview={compliancePreview}
          workflowHints={workflowHints}
        />
      </div>

      <LeadStickyActionBar
        cancelTo={`/dashboard/leads/${publicId}`}
        isSaving={isSaving}
        onSubmitAttempt={handleSubmitAttempt}
        primaryLabel="Save Changes"
        savingLabel="Saving..."
      />
    </div>
  );
};

export default LeadEditPage;
