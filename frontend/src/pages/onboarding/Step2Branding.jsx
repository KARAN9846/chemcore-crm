import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/layout/TopBar";
import ProgressBar from "../../components/onboarding/layout/ProgressBar";
import FormActions from "../../components/onboarding/form/FormActions";
import BrandColorPicker from "../../components/branding/BrandColorPicker";
import WorkspaceSection from "../../components/branding/WorkspaceSection";
import DomainSection from "../../components/branding/DomainSection";
import EmailSection from "../../components/branding/EmailSection";
import BrandingPreview from "../../components/branding/BrandingPreview";
import { getBranding } from "../../api/onboardingHydration.api";
import { useOnboarding } from "../../context/useOnboarding";
import { getCompanyId } from "../../utils/company";
import { ONBOARDING_KEYS } from "../../utils/onboardingStorage";
import { showError } from "../../utils/toast";
import { saveBranding } from "../../lib/api/saveBranding";
import {
  brandingSchema,
  normalizeBrandingInput,
} from "../../../../shared/validation/branding.schema.js";

const STEP_2_DRAFT_KEY = ONBOARDING_KEYS.STEP_2_DRAFT;
const REQUIRED_FIELDS = [
  "primaryColor",
  "workspaceName",
  "fromName",
  "replyTo",
];

const DEFAULT_FORM = {
  primaryColor: "#1f7a35",
  workspaceName: "",
  tagline: "",
  fromName: "",
  replyTo: "",
  subdomain: "",
  customDomain: "",
};

const mapBrandingResponseToForm = (branding = {}) => ({
  primaryColor: branding.primary_color || "",
  workspaceName: branding.workspace_name || "",
  tagline: branding.tagline || "",
  fromName: branding.from_name || "",
  replyTo: branding.reply_to_email || "",
  subdomain: branding.subdomain || "",
  customDomain: branding.custom_domain || "",
});

const validateBrandingForm = (form) => {
  const result = brandingSchema.safeParse(normalizeBrandingInput(form));

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce((acc, issue) => {
    const fieldName = issue.path[0];

    if (fieldName && !acc[fieldName]) {
      acc[fieldName] = issue.message;
    }

    return acc;
  }, {});
};

const Step2Branding = () => {
  const navigate = useNavigate();
  const { isHydrated, setCurrentStep } = useOnboarding();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    console.log("STEP2 MOUNT");
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    let isMounted = true;

    const hydrateBranding = async () => {
      console.log("HDRATING STEP 2");
      setHydrating(true);

      let savedDraft = null;

      try {
        const rawDraft = localStorage.getItem(STEP_2_DRAFT_KEY);

        if (rawDraft) {
          savedDraft = JSON.parse(rawDraft);
        }
      } catch (error) {
        console.error("ERROR:", error);
        localStorage.removeItem(STEP_2_DRAFT_KEY);
      }

      try {
        const activeCompanyId = getCompanyId();
        console.log("ACTIVE COMPANY ID:", activeCompanyId);
        if (!activeCompanyId) {
          return;
        }

        const response = await getBranding(activeCompanyId);
        const brandingData = response?.data || null;

        console.log("FETCHED DATA:", brandingData);

        if (isMounted) {
          if (brandingData) {
            console.log("SETTING FORM STATE");
            setForm(mapBrandingResponseToForm(brandingData));
          } else if (savedDraft) {
            console.log("SETTING FORM STATE");
            setForm(savedDraft);
          } else {
            setForm(DEFAULT_FORM);
          }
        }
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          "Unable to load saved branding right now.";

        if (isMounted) {
          setSubmitError(message);
          showError(message);
        }

        console.error("ERROR:", error);
      } finally {
        if (isMounted) {
          setDraftHydrated(true);
          setHydrating(false);
        }
      }
    };

    hydrateBranding();

    return () => {
      isMounted = false;
    };
  }, [isHydrated]);

  useEffect(() => {
    if (!draftHydrated) {
      return;
    }

    localStorage.setItem(STEP_2_DRAFT_KEY, JSON.stringify(form));
  }, [draftHydrated, form]);

  useEffect(() => {
    const touchedFields = Object.keys(touched).filter(
      (field) => touched[field],
    );

    if (touchedFields.length === 0) {
      return;
    }

    const validationErrors = validateBrandingForm(form);

    setErrors((prev) => {
      const nextErrors = { ...prev };

      touchedFields.forEach((field) => {
        delete nextErrors[field];

        if (validationErrors[field]) {
          nextErrors[field] = validationErrors[field];
        }
      });

      return nextErrors;
    });
  }, [form, touched]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSubmitError("");
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const markTouched = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const scrollToFirstInvalidField = (nextErrors) => {
    const firstFieldName = Object.keys(nextErrors)[0];

    if (!firstFieldName) {
      return;
    }

    const field = document.querySelector(`[name="${firstFieldName}"]`);

    if (field) {
      field.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => field.focus(), 250);
    }
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (loading) {
      return;
    }

    const nextErrors = validateBrandingForm(form);

    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(REQUIRED_FIELDS.map((field) => [field, true])),
    }));
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitError("Please fix the required branding fields.");
      scrollToFirstInvalidField(nextErrors);
      showError("Please fix required fields");
      return;
    }

    try {
      setLoading(true);
      setSubmitError("");
      console.log("SAVE START");

      const activeCompanyId = getCompanyId();
      console.log("ACTIVE COMPANY ID:", activeCompanyId);

      if (!activeCompanyId) {
        showError("Company ID missing");
        setLoading(false);
        return;
      }

      const saveRes = await saveBranding(
        activeCompanyId,
        normalizeBrandingInput(form),
      );

      if (saveRes?.success === false) {
        throw new Error(saveRes.message || "Unable to save branding.");
      }

      console.log("SAVE COMPLETE");
      console.log("STEP2 SAVE SUCCESS");
      localStorage.removeItem(STEP_2_DRAFT_KEY);
      localStorage.setItem(ONBOARDING_KEYS.STEP, "3");
      setCurrentStep(3);
      console.log("NAVIGATE START");
      navigate("/onboarding/step3");
    } catch (error) {
      const backendErrors = (
        (error.response && error.response.data?.errors) ||
        []
      ).reduce((acc, errorItem) => {
        if (errorItem.field && !acc[errorItem.field]) {
          acc[errorItem.field] = errorItem.message;
        }

        return acc;
      }, {});

      if (Object.keys(backendErrors).length > 0) {
        setErrors(backendErrors);
        setTouched((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.keys(backendErrors).map((field) => [field, true]),
          ),
        }));
        scrollToFirstInvalidField(backendErrors);
      }

      const message = error?.response
        ? error.response.data?.message ||
          "Something went wrong. Please try again."
        : error.message ||
          "Network error. Please check your internet connection.";

      setSubmitError(message);
      showError(message);
      console.error("ERROR:", error);
      setLoading(false);
    }
  };

  if (!isHydrated || hydrating) {
    return null;
  }

  return (
    <div className="step2">
      <TopBar variant="secure" />
      <ProgressBar currentStep={2} />

      <div className="main-wrap branding-layout">
        <div className="form-container branding-form-container">
          <div className="step-header">
            <div className="step-badge">
              <i className="bi bi-palette"></i> Step 2 of 6
            </div>

            <h2 className="step-title">Branding & White-Label</h2>

            <p className="step-sub">
              Customise how your workspace looks. This affects the navbar, email
              headers, quotation PDFs and your custom login URL.
            </p>
          </div>

          <form
            noValidate
            onSubmit={(event) => {
              console.log("FORM SUBMIT");
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            {Object.keys(errors).length > 0 ? (
              <div
                className="form-error-summary"
                role="alert"
                aria-live="polite"
              >
                Please fix the highlighted fields before continuing
              </div>
            ) : null}

            {submitError ? (
              <div
                className="form-submit-error"
                role="alert"
                aria-live="polite"
              >
                {submitError}
              </div>
            ) : null}

            <BrandColorPicker
              value={form.primaryColor}
              error={errors.primaryColor}
              touched={touched.primaryColor}
              onChange={updateField}
              onBlur={markTouched}
            />

            <WorkspaceSection
              form={form}
              errors={errors}
              touched={touched}
              onChange={updateField}
              onBlur={markTouched}
            />

            <DomainSection
              form={form}
              onChange={updateField}
              onBlur={markTouched}
            />

            <EmailSection
              form={form}
              errors={errors}
              touched={touched}
              onChange={updateField}
              onBlur={markTouched}
            />

            <FormActions
              loading={loading}
              onBack={() => {
                console.log("STEP2 BACK CLICK");
                console.log("STEP2 BACK NAVIGATE");
                navigate("/onboarding/step1");
              }}
              onContinue={handleSubmit}
            />
          </form>
        </div>

        <BrandingPreview form={form} />
      </div>
    </div>
  );
};

export default Step2Branding;
