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
import { useToast } from "../../components/common/ToastProvider";
import { useOnboarding } from "../../context/OnboardingContext";
import {
  getBranding,
  saveBranding,
} from "../../lib/api/saveBranding";
import {
  brandingSchema,
  normalizeBrandingInput,
} from "../../../../shared/validation/branding.schema.js";

const STEP_2_DRAFT_KEY = "step2Draft";
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
  const { showToast } = useToast();
  const { companyId, currentStep, isHydrated, setCurrentStep } =
    useOnboarding();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [isFetchingBranding, setIsFetchingBranding] = useState(true);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!companyId || currentStep < 2) {
      navigate("/onboarding/step-1", { replace: true });
      return;
    }

    let isMounted = true;

    const hydrateBranding = async () => {
      setIsFetchingBranding(true);

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
        const response = await getBranding(companyId);
        const brandingData = response?.data?.data || null;
        console.log("API DATA:", brandingData);
        console.log("DRAFT DATA:", savedDraft);

        if (isMounted) {
          if (brandingData) {
            setForm(mapBrandingResponseToForm(brandingData));
          } else if (savedDraft) {
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
          showToast({
            type: "error",
            message,
          });
        }

        console.error("ERROR:", error);
      } finally {
        if (isMounted) {
          setDraftHydrated(true);
          setIsFetchingBranding(false);
        }
      }
    };

    hydrateBranding();

    return () => {
      isMounted = false;
    };
  }, [companyId, currentStep, isHydrated, navigate, showToast]);

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
    event.preventDefault();

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
      showToast({
        type: "error",
        message: "Please fix required fields",
      });
      return;
    }

    try {
      setLoading(true);
      setSubmitError("");

      await saveBranding(companyId, normalizeBrandingInput(form));

      localStorage.removeItem(STEP_2_DRAFT_KEY);
      localStorage.setItem("onboardingStep", "3");
      setCurrentStep(3);
      navigate("/onboarding/team");
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

      const message = !error.response
        ? "Network error. Please check your internet connection."
        : error?.response?.data?.message ||
          "Something went wrong. Please try again.";

      setSubmitError(message);
      showToast({
        type: "error",
        message,
      });
      console.error("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated || !companyId || currentStep < 2 || isFetchingBranding) {
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

          <form noValidate onSubmit={handleSubmit}>
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

            <FormActions loading={loading} />
          </form>
        </div>

        <BrandingPreview form={form} />
      </div>
    </div>
  );
};

export default Step2Branding;
