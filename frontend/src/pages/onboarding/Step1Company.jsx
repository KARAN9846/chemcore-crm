import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/layout/TopBar";
import ProgressBar from "../../components/onboarding/layout/ProgressBar";
import StepHeader from "../../components/onboarding/layout/StepHeader";

import BasicInfoSection from "../../components/onboarding/form/BasicInfoSection";
import RegistrationSection from "../../components/onboarding/form/RegistrationSection";
import AddressSection from "../../components/onboarding/form/AddressSection";
import ContactSection from "../../components/onboarding/form/ContactSection";
import FormActions from "../../components/onboarding/form/FormActions";
import { useOnboarding } from "../../context/useOnboarding";
import {
  ONBOARDING_KEYS,
  readOnboardingCompanyId,
} from "../../utils/onboardingStorage";
import { showError } from "../../utils/toast";
import {
  companyFormFieldMap,
  companySchema,
  normalizeCompanyInput,
} from "../../../../shared/validation/company.schema.js";
import { saveCompany } from "../../lib/api/saveCompany";

const STEP_1_DRAFT_KEY = ONBOARDING_KEYS.STEP_1_DRAFT;

const REQUIRED_FIELDS = [
  "companyName",
  "companyType",
  "currency",
  "email",
  "phone",
  "address",
  "city",
  "pincode",
  "country",
  "timezone",
];

const getValidationPayload = (formData) =>
  normalizeCompanyInput({
    companyName: formData.companyName,
    companyType: formData.companyType,
    baseCurrency: formData.currency,
    companyEmail: formData.email,
    companyPhone: (formData.phone || "").replace(/\D/g, ""),
    addressLine1: formData.address,
    city: formData.city,
    pinCode: formData.pincode,
    country: formData.country,
    timezone: formData.timezone,
    description: formData.description,
    gstNumber: formData.gstNumber,
    iecCode: formData.iecCode,
    panNumber: formData.panNumber,
    yearEstablished: formData.yearEstablished,
    addressLine2: formData.address2,
    state: formData.state,
    website: formData.website,
  });

const validateFormData = (formData) => {
  const validationResult = companySchema.safeParse(
    getValidationPayload(formData),
  );

  if (validationResult.success) {
    return {};
  }

  return validationResult.error.issues.reduce((acc, issue) => {
    const schemaField = issue.path[0];
    const formField = companyFormFieldMap[schemaField];

    if (formField && !acc[formField]) {
      acc[formField] = issue.message;
    }

    return acc;
  }, {});
};

const Step1Company = () => {
  const navigate = useNavigate();
  const { companyId, setCompanyId, setCurrentStep } = useOnboarding();
  const [formDataState, setFormDataState] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const savedDraft = localStorage.getItem(STEP_1_DRAFT_KEY);

    if (savedDraft) {
      try {
        setFormDataState(JSON.parse(savedDraft));
      } catch (error) {
        console.error("ERROR:", error);
        localStorage.removeItem(STEP_1_DRAFT_KEY);
      }
    }

    const savedStep = Number(localStorage.getItem(ONBOARDING_KEYS.STEP));
    if (!Number.isFinite(savedStep) || savedStep < 1) {
      setCurrentStep(1);
    }

    setDraftHydrated(true);
  }, [setCurrentStep]);

  useEffect(() => {
    if (!draftHydrated) {
      return;
    }

    localStorage.setItem(STEP_1_DRAFT_KEY, JSON.stringify(formDataState));
  }, [draftHydrated, formDataState]);

  const clearFieldError = (fieldName) => {
    setErrors((prev) => {
      if (!prev[fieldName]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[fieldName];
      return nextErrors;
    });
  };

  useEffect(() => {
    const touchedFields = Object.keys(touched).filter(
      (field) => touched[field],
    );

    if (touchedFields.length === 0) {
      return;
    }

    const validationErrors = validateFormData(formDataState);

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
  }, [formDataState, touched]);

  const scrollToFirstInvalidField = (nextErrors) => {
    const firstFieldName = REQUIRED_FIELDS.find((field) => nextErrors[field]);

    if (!firstFieldName) {
      return;
    }

    const field = document.querySelector(`[name="${firstFieldName}"]`);

    if (field) {
      field.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => field.focus(), 250);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    const nextErrors = validateFormData(formDataState);

    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(REQUIRED_FIELDS.map((field) => [field, true])),
    }));
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitError("Please fill all required fields.");
      scrollToFirstInvalidField(nextErrors);
      showError("Please fill all required fields");
      return;
    }

    setSubmitError("");

    const formData = new FormData();
    const activeCompanyId = companyId || readOnboardingCompanyId();
    const url = activeCompanyId
      ? `http://localhost:5000/api/onboarding/company/${activeCompanyId}`
      : "http://localhost:5000/api/onboarding/company";
    const method = activeCompanyId ? "PUT" : "POST";
    const validationPayload = getValidationPayload(formDataState);

    const safeAppend = (key, value) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    };

    safeAppend("companyName", validationPayload.companyName);
    safeAppend("companyType", validationPayload.companyType);
    safeAppend("baseCurrency", validationPayload.baseCurrency);
    safeAppend("companyEmail", validationPayload.companyEmail);
    safeAppend("companyPhone", validationPayload.companyPhone);
    safeAppend("addressLine1", validationPayload.addressLine1);
    safeAppend("city", validationPayload.city);
    safeAppend("pinCode", validationPayload.pinCode);
    safeAppend("country", validationPayload.country);
    safeAppend("timezone", validationPayload.timezone);
    safeAppend("description", validationPayload.description);
    safeAppend("gstNumber", validationPayload.gstNumber);
    safeAppend("iecCode", validationPayload.iecCode);
    safeAppend("panNumber", validationPayload.panNumber);
    safeAppend("yearEstablished", validationPayload.yearEstablished);
    safeAppend("addressLine2", validationPayload.addressLine2);
    safeAppend("state", validationPayload.state);
    safeAppend("website", validationPayload.website);

    if (logoFile) {
      safeAppend("logo", logoFile);
    }

    try {
      setLoading(true);

      const data = await saveCompany({
        url,
        method,
        body: formData,
      });

      if (data?.data?.companyId) {
        setCompanyId(String(data.data.companyId));
      }

      localStorage.setItem(ONBOARDING_KEYS.STEP, "2");
      setCurrentStep(2);
      localStorage.removeItem(STEP_1_DRAFT_KEY);
      console.log("SUCCESS:", data);
      navigate("/onboarding/step2");
    } catch (error) {
      const backendErrors = (
        (error.response && error.response.data?.errors) ||
        []
      ).reduce((acc, errorItem) => {
        const fieldName =
          companyFormFieldMap[errorItem.field] || errorItem.field;

        if (fieldName) {
          acc[fieldName] = errorItem.message;
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
      showError(message);
      console.error("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="step1">
      <TopBar variant="secure" />
      <ProgressBar />

      <div className="main-wrap">
        <div className="form-container">
          <StepHeader />

          <form noValidate onSubmit={handleSubmit}>
            {hasErrors ? (
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

            <BasicInfoSection
              formData={formDataState}
              setFormData={setFormDataState}
              setLogoFile={setLogoFile}
              errors={errors}
              touched={touched}
              setTouched={setTouched}
              clearFieldError={clearFieldError}
            />

            <RegistrationSection
              formData={formDataState}
              setFormData={setFormDataState}
              errors={errors}
              touched={touched}
              setTouched={setTouched}
              clearFieldError={clearFieldError}
            />

            <AddressSection
              formData={formDataState}
              setFormData={setFormDataState}
              errors={errors}
              touched={touched}
              setTouched={setTouched}
              clearFieldError={clearFieldError}
            />

            <ContactSection
              formData={formDataState}
              setFormData={setFormDataState}
              errors={errors}
              touched={touched}
              setTouched={setTouched}
              clearFieldError={clearFieldError}
            />

            <FormActions loading={loading} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step1Company;
