import { useCallback, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createLead } from "../../api/leads.api";
import LeadStickyActionBar from "../../components/leads/common/LeadStickyActionBar";
import LeadInsightsPanel from "../../components/leads/insights/LeadInsightsPanel";
import LeadChemicalRequirementsSection from "../../components/leads/sections/LeadChemicalRequirementsSection";
import LeadContactSection from "../../components/leads/sections/LeadContactSection";
import LeadFollowupSection from "../../components/leads/sections/LeadFollowupSection";
import LeadSourceAssignmentSection from "../../components/leads/sections/LeadSourceAssignmentSection";
import LeadTradeTermsSection from "../../components/leads/sections/LeadTradeTermsSection";
import { initialLeadFormState } from "../../features/leads/constants/leadFormDefaults";
import {
  getLeadComplianceWarnings,
  getLeadWorkflowHints,
} from "../../features/leads/logic/leadCompliance";
import { calculateLeadScore } from "../../features/leads/logic/leadScoring";
import {
  hasTouchedLeadFields,
  validateLeadForm,
} from "../../features/leads/utils/leadFormValidation";
import { getCompanyId } from "../../utils/company";
import {
  showError,
  showSuccess,
  showValidationWarning,
  showWarning,
} from "../../utils/toast";

const MIN_SUBMIT_LOCK_MS = 1500;

const AddLeadPage = () => {
  const navigate = useNavigate();
  const [leadForm, setLeadForm] = useState(() => initialLeadFormState);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [duplicateLead, setDuplicateLead] = useState(null);
  const submitLockRef = useRef(false);

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
    setSubmitSuccess("");
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
      handleArrayToggle("tradeTerms", "incoterms", term);
      setTouched((currentTouched) => ({
        ...currentTouched,
        tradeTerms: {
          ...currentTouched.tradeTerms,
          incoterms: true,
        },
      }));
    },
    [handleArrayToggle],
  );

  const handlePaymentTermToggle = useCallback(
    (term) => {
      handleArrayToggle("tradeTerms", "paymentTerms", term);
    },
    [handleArrayToggle],
  );

  const executeLeadSubmit = useCallback(async ({ continueAnyway = false } = {}) => {
    if (submitLockRef.current) {
      return;
    }

    submitLockRef.current = true;
    const lockStartedAt = Date.now();
    setIsSaving(true);
    setSubmitError("");
    setSubmitSuccess("");
    setDuplicateLead(null);

    try {
      const response = await createLead({
        companyId: getCompanyId(),
        leadForm: leadFormWithDerivedValues,
        intelligence: {
          score: scorePreview.score,
          status: scorePreview.status,
        },
        continueAnyway,
      });

      const lead = response?.data;
      const message = response?.message || "Lead created successfully";
      setSubmitSuccess(message);
      showSuccess(message);

      if (lead?.publicId) {
        navigate(`/dashboard/leads/${lead.publicId}`, {
          state: { createdLead: lead },
        });
      }
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.duplicate) {
        setDuplicateLead(responseData.existingLead);
        setSubmitError(responseData.message);
        showWarning(responseData.message || "Possible duplicate lead detected");
        return;
      }

      const message =
        responseData?.message ||
        responseData?.errors?.[0]?.message ||
        "Unable to create lead right now";
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
  }, [leadFormWithDerivedValues, navigate, scorePreview]);

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

    await executeLeadSubmit();
  }, [executeLeadSubmit, leadForm]);

  const handleContinueDuplicate = useCallback(() => {
    executeLeadSubmit({ continueAnyway: true });
  }, [executeLeadSubmit]);

  const handleCancelDuplicate = useCallback(() => {
    setDuplicateLead(null);
    setSubmitError("");
  }, []);

  const handleFormKeyDown = useCallback((event) => {
    if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
      event.preventDefault();
    }
  }, []);

  return (
    <div className="lead-page">
      <div className="lead-breadcrumb-bar">
        <nav className="lead-breadcrumb" aria-label="Breadcrumb">
          <Link to="/dashboard/leads">
            <i className="bi bi-funnel" aria-hidden="true"></i>
            Leads
          </Link>
          <span className="lead-breadcrumb-separator">/</span>
          <span>Add New Lead</span>
        </nav>
      </div>

      <div className="lead-page-header">
        <div>
          <h2>Add New Lead</h2>
          <p>Capture buyer requirements, trade terms, source, and first follow-up details.</p>
        </div>
      </div>

      {submitError ? (
        <div className="lead-submit-alert lead-submit-alert-error">
          <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
          {submitError}
        </div>
      ) : null}

      {submitSuccess ? (
        <div className="lead-submit-alert lead-submit-alert-success">
          <i className="bi bi-check-circle-fill" aria-hidden="true"></i>
          {submitSuccess}
        </div>
      ) : null}

      {duplicateLead ? (
        <div className="lead-duplicate-warning" role="alert">
          <div>
            <strong>Possible duplicate lead</strong>
            <span>
              {duplicateLead.companyName} already exists for{" "}
              {duplicateLead.chemicals?.join(", ") || "selected chemicals"}.
            </span>
          </div>
          <div className="lead-duplicate-actions">
            <button
              type="button"
              className="lead-button lead-button-secondary"
              onClick={handleCancelDuplicate}
            >
              Cancel
            </button>
            <button
              type="button"
              className="lead-button lead-button-primary"
              disabled={isSaving}
              onClick={handleContinueDuplicate}
            >
              Continue Anyway
            </button>
          </div>
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
        isSaving={isSaving}
        onSubmitAttempt={handleSubmitAttempt}
      />
    </div>
  );
};

export default AddLeadPage;
