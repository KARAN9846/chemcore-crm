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
import { getCompany } from "../../api/onboardingHydration.api";
import { useOnboarding } from "../../context/useOnboarding";
import { ONBOARDING_KEYS } from "../../utils/onboardingStorage";
import { getCompanyId } from "../../utils/company";
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

const mapCompanyResponseToForm = (company = {}) => ({
  companyName: company.company_name || "",
  companyType: company.company_type || "",
  description: company.description || "",
  gstNumber: company.gst_number || "",
  iecCode: company.iec_code || "",
  panNumber: company.pan_number || "",
  yearEstablished: company.year_established || "",
  address: company.address || "",
  address2: company.address2 || "",
  city: company.city || "",
  state: company.state || "",
  pincode: company.pincode || "",
  country: company.country || "",
  currency: company.currency || "",
  email: company.contact_email || "",
  phone: company.contact_phone || "",
  website: company.website || "",
  timezone: company.timezone || "",
});

const Step1Company = () => {
  const navigate = useNavigate();
  const { setCompanyId, setCurrentStep, setOnboardingData } = useOnboarding();
  const [formDataState, setFormDataState] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const hydrateCompany = async () => {
      console.log("HYDRATION START");

      let savedDraft = null;

      try {
        const rawDraft = localStorage.getItem(STEP_1_DRAFT_KEY);

        if (rawDraft) {
          savedDraft = JSON.parse(rawDraft);
        }
      } catch (error) {
        console.error("ERROR:", error);
        localStorage.removeItem(STEP_1_DRAFT_KEY);
      }

      try {
        const activeCompanyId = getCompanyId();

        if (activeCompanyId) {
          const response = await getCompany(activeCompanyId);
          const company = response?.data || null;

          console.log("FETCHED DATA:", company);

          if (isMounted && company) {
            console.log("SETTING FORM STATE");
            setFormDataState(mapCompanyResponseToForm(company));
            return;
          }
        }

        console.log("FETCHED DATA:", null);

        if (isMounted && savedDraft) {
          console.log("SETTING FORM STATE");
          setFormDataState(savedDraft);
        }
      } catch (error) {
        console.error("Company hydration error:", error);

        if (isMounted && savedDraft) {
          console.log("SETTING FORM STATE");
          setFormDataState(savedDraft);
        }
      } finally {
        if (isMounted) {
          setDraftHydrated(true);
          setHydrating(false);
        }
      }
    };

    hydrateCompany();

    return () => {
      isMounted = false;
    };
  }, []);

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
    e?.preventDefault();
    e?.stopPropagation();
    console.log("STEP1 BUTTON CLICK HANDLER");

    if (loading) {
      console.log("STEP1 SUBMIT BLOCKED: loading=true");
      return;
    }

    console.log("STEP1 VALIDATION START");
    const nextErrors = validateFormData(formDataState);
    console.log("STEP1 VALIDATION RESULT:", nextErrors);

    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(REQUIRED_FIELDS.map((field) => [field, true])),
    }));
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      console.log("STEP1 VALIDATION FAILED");
      setSubmitError("Please fill all required fields.");
      scrollToFirstInvalidField(nextErrors);
      showError("Please fill all required fields");
      return;
    }

    console.log("STEP1 VALIDATION PASSED");
    setSubmitError("");

    const formData = new FormData();
    const activeCompanyId = getCompanyId();
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

    let didNavigate = false;

    try {
      setLoading(true);
      console.log("SAVE START");
      console.log("STEP1 API SAVE START:", { method, url });

      const data = await saveCompany({
        url,
        method,
        body: formData,
      });

      console.log("SAVE SUCCESS");
      console.log("STEP1 API SAVE RESPONSE:", data);

      const savedCompanyId =
        data?.companyId || data?.data?.companyId || data?.data?.id || data?.id;

      if (!savedCompanyId) {
        throw new Error("Company ID missing after save");
      }

      localStorage.setItem("companyId", String(savedCompanyId));
      console.log("ACTIVE COMPANY ID:", getCompanyId());
      setCompanyId(String(savedCompanyId));
      setOnboardingData((prev) => ({
        ...prev,
        companyId: String(savedCompanyId),
      }));
      setCurrentStep(2);
      localStorage.setItem(ONBOARDING_KEYS.STEP, "2");
      localStorage.removeItem(STEP_1_DRAFT_KEY);
      didNavigate = true;
      console.log("SAVE COMPLETE");
      console.log("NAVIGATE START");
      console.log("STEP1 NAVIGATE STEP2", {
        to: "/onboarding/step2",
        savedCompanyId,
      });
      navigate("/onboarding/step2");
    } catch (error) {
      console.log("STEP1 API SAVE ERROR:", error);
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

      const message = error?.response
        ? error.response.data?.message || "Something went wrong. Please try again."
        : error.message ||
          "Network error. Please check your internet connection.";

      setSubmitError(message);
      showError(message);
      console.error("ERROR:", error);
    } finally {
      if (!didNavigate) {
        setLoading(false);
      }
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  if (hydrating) {
    return null;
  }

  return (
    <div className="step1">
      <TopBar variant="secure" />
      <ProgressBar />

      <div className="main-wrap">
        <div className="form-container">
          <StepHeader />

          <form
            noValidate
            autoComplete="off"
            onSubmit={(event) => {
              console.log("FORM SUBMIT");
              console.log("STEP1 FORM SUBMIT EVENT");
              event.preventDefault();
              event.stopPropagation();
            }}
          >
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

            <FormActions loading={loading} onContinue={handleSubmit} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step1Company;
