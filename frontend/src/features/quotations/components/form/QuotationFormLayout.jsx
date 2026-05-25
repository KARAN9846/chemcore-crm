import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getLeadOptionsForQuotation } from "../../api/quotations.api";
import {
  createEmptyLineItem,
  createQuotationStateFromPrefill,
} from "../../constants/quotationDefaults";
import QuotationStickyActionBar from "../common/QuotationStickyActionBar";
import QuotationCreateHero from "../hero/QuotationCreateHero";
import QuotationLineItemsSection from "../sections/QuotationLineItemsSection";
import ClientDetailsSection from "../sections/ClientDetailsSection";
import QuotationDocumentsSection from "../sections/QuotationDocumentsSection";
import QuotationRemarksSection from "../sections/QuotationRemarksSection";
import TradeTermsSection from "../sections/TradeTermsSection";
import QuotationMarginSidebar from "../sidebar/QuotationMarginSidebar";
import { getQuotationTotals } from "../../utils/quotationCalculations";
import { getQuotationMarginSnapshot } from "../../utils/quotationMarginUtils";
import {
  getTouchedQuotationErrors,
  getValidatedQuotationPayload,
  getQuotationWarnings,
  hasTouchedQuotationFields,
  validateQuotationForm,
} from "../../utils/quotationValidation";
import { getCompanyId } from "../../../../utils/company";
import {
  showError,
  showSuccess,
  showValidationWarning,
} from "../../../../utils/toast";

const MIN_SUBMIT_LOCK_MS = 1500;

const QuotationFormLayout = ({
  breadcrumbLabel = "New Quotation",
  cancelTo = "/dashboard/quotations",
  children,
  draftLabel = "Save Draft",
  getTargetPath,
  heroSubtitle,
  heroTitle = "Create Quotation",
  initialData,
  mode = "create",
  onSave,
  previewEnabled = true,
  primaryLabel = "Save & Send",
  saveSuccessFallback = "Quotation saved successfully",
}) => {
  const navigate = useNavigate();
  const [quotationForm, setQuotationForm] = useState(() =>
    createQuotationStateFromPrefill(initialData),
  );
  const [leadOptions, setLeadOptions] = useState([]);
  const [isLoadingLeadOptions, setIsLoadingLeadOptions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const submitLockRef = useRef(false);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    setQuotationForm(createQuotationStateFromPrefill(initialData));
  }, [initialData]);

  useEffect(() => {
    let isMounted = true;
    const companyId = getCompanyId();

    if (!companyId) {
      return undefined;
    }

    const loadLeadOptions = async () => {
      setIsLoadingLeadOptions(true);

      try {
        const response = await getLeadOptionsForQuotation({ companyId });

        if (isMounted) {
          setLeadOptions(response.data ?? []);
        }
      } catch {
        if (isMounted) {
          showError("Unable to load lead options");
        }
      } finally {
        if (isMounted) {
          setIsLoadingLeadOptions(false);
        }
      }
    };

    loadLeadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const totals = useMemo(
    () =>
      getQuotationTotals({
        charges: quotationForm.charges,
        currency: quotationForm.quotationInfo.currency,
        lineItems: quotationForm.lineItems,
      }),
    [
      quotationForm.charges,
      quotationForm.lineItems,
      quotationForm.quotationInfo.currency,
    ],
  );

  const marginSnapshot = useMemo(() => getQuotationMarginSnapshot(totals), [totals]);
  const errors = useMemo(() => {
    if (!submitAttempted && !hasTouchedQuotationFields(touched)) {
      return {};
    }

    const nextErrors = validateQuotationForm(quotationForm, totals);

    return submitAttempted
      ? nextErrors
      : getTouchedQuotationErrors(nextErrors, touched);
  }, [quotationForm, submitAttempted, totals, touched]);
  const blockingErrors = useMemo(
    () => validateQuotationForm(quotationForm, totals),
    [quotationForm, totals],
  );
  const warnings = useMemo(
    () => getQuotationWarnings({ quotationForm, marginSnapshot, totals }),
    [marginSnapshot, quotationForm, totals],
  );
  const hasBlockingErrors = Object.keys(blockingErrors).length > 0;
  const canPreview = quotationForm.lineItems.length > 0 && totals.grandTotal > 0;
  const canSend = canPreview && marginSnapshot.marginHealth !== "loss";

  const updateSectionField = useCallback((section, field, value) => {
    setQuotationForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  }, []);

  const markTouched = useCallback((section, field, nestedField) => {
    setTouched((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]:
          nestedField === undefined
            ? true
            : {
                ...current[section]?.[field],
                [nestedField]: true,
              },
      },
    }));
  }, []);

  const handleClientSelect = useCallback((clientId) => {
    const selectedLead = leadOptions.find((lead) => lead.publicId === clientId);

    setQuotationForm((current) => ({
      ...current,
      client: {
        ...current.client,
        leadId: clientId,
        name: selectedLead?.clientName ?? current.client.name,
        company: selectedLead?.companyName ?? current.client.company,
        email: selectedLead?.email ?? current.client.email,
        country: selectedLead?.country ?? current.client.country,
      },
      quotationInfo: {
        ...current.quotationInfo,
        currency: selectedLead?.currency || current.quotationInfo.currency,
      },
    }));
  }, [leadOptions]);

  const handleAddLine = useCallback(() => {
    setQuotationForm((current) => ({
      ...current,
      lineItems: [...current.lineItems, createEmptyLineItem()],
    }));
  }, []);

  const handleDuplicateLine = useCallback((lineId) => {
    setQuotationForm((current) => {
      const sourceLine = current.lineItems.find((item) => item.id === lineId);

      if (!sourceLine) {
        return current;
      }

      return {
        ...current,
        lineItems: [
          ...current.lineItems,
          {
            ...sourceLine,
            id: crypto.randomUUID(),
          },
        ],
      };
    });
  }, []);

  const handleUpdateLine = useCallback((lineId, field, value) => {
    setQuotationForm((current) => ({
      ...current,
      lineItems: current.lineItems.map((item) =>
        item.id === lineId ? { ...item, [field]: value } : item,
      ),
    }));
  }, []);

  const handleLineBlur = useCallback((lineId, field) => {
    const index = quotationForm.lineItems.findIndex((item) => item.id === lineId);

    if (index >= 0) {
      markTouched("lineItems", index, field);
    }
  }, [markTouched, quotationForm.lineItems]);

  const handleRemoveLine = useCallback((lineId) => {
    setQuotationForm((current) => {
      if (current.lineItems.length <= 1) {
        return current;
      }

      return {
        ...current,
        lineItems: current.lineItems.filter((item) => item.id !== lineId),
      };
    });
  }, []);

  const handleToggleDocument = useCallback((documentId) => {
    setQuotationForm((current) => ({
      ...current,
      documents: current.documents.map((document) =>
        document.id === documentId
          ? { ...document, selected: !document.selected }
          : document,
      ),
    }));
  }, []);

  const handleSubmitAttempt = useCallback(async ({
    destination = "detail",
    saveMode = "send",
  } = {}) => {
    if (submitLockRef.current) {
      return;
    }

    setSubmitAttempted(true);

    const validation = getValidatedQuotationPayload(quotationForm, totals);

    if (!validation.success) {
      showValidationWarning("Please fix quotation details before saving");
      return;
    }

    const companyId = getCompanyId();

    if (!companyId) {
      showError("Company ID missing. Please complete onboarding first.");
      return;
    }

    submitLockRef.current = true;
    const lockStartedAt = Date.now();
    setIsSaving(true);

    try {
      const response = await onSave({
        companyId,
        destination,
        quotationForm: validation.data,
        saveMode,
      });
      showSuccess(response.message || saveSuccessFallback);
      const targetPath = getTargetPath(response.data, destination);

      navigate(targetPath, {
        state: { quotation: response.data },
      });
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.duplicate) {
        showError(responseData.message || "Quotation number already exists");
      } else {
        showError(responseData?.message || "Failed to save quotation");
      }
    } finally {
      const elapsed = Date.now() - lockStartedAt;
      const remainingLock = Math.max(0, MIN_SUBMIT_LOCK_MS - elapsed);

      window.setTimeout(() => {
        submitLockRef.current = false;
        setIsSaving(false);
      }, remainingLock);
    }
  }, [getTargetPath, navigate, onSave, quotationForm, saveSuccessFallback, totals]);

  const handleFormKeyDown = useCallback((event) => {
    if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
      event.preventDefault();
    }
  }, []);

  return (
    <div className="quotation-page">
      <div className="lead-breadcrumb-bar">
        <nav className="lead-breadcrumb" aria-label="Breadcrumb">
          <Link to="/dashboard/quotations">
            <i className="bi bi-file-earmark-text" aria-hidden="true"></i>
            Quotations
          </Link>
          <span className="lead-breadcrumb-separator">/</span>
          <span>{breadcrumbLabel}</span>
        </nav>
        <span className="quotation-draft-note">
          <i className="bi bi-info-circle" aria-hidden="true"></i>
          {mode === "revise"
            ? "Revision creates a new quotation version"
            : "Draft workflow ready for autosave"}
        </span>
      </div>

      <QuotationCreateHero
        mode={mode}
        marginSnapshot={marginSnapshot}
        quotationForm={quotationForm}
        subtitle={heroSubtitle}
        title={heroTitle}
        totals={totals}
        warnings={warnings}
      />

      {children}

      <div className="quotation-workspace">
        <form className="quotation-form" noValidate onKeyDown={handleFormKeyDown}>
          <ClientDetailsSection
            client={quotationForm.client}
            errors={errors}
            isLoadingLeadOptions={isLoadingLeadOptions}
            leadOptions={leadOptions}
            onBlur={markTouched}
            quotationInfo={quotationForm.quotationInfo}
            onClientSelect={handleClientSelect}
            onClientChange={(field, value) =>
              updateSectionField("client", field, value)
            }
            onQuotationInfoChange={(field, value) =>
              updateSectionField("quotationInfo", field, value)
            }
          />
          <QuotationLineItemsSection
            chargeErrors={errors.charges}
            charges={quotationForm.charges}
            currency={quotationForm.quotationInfo.currency}
            errors={errors.lineItems}
            lineItems={totals.lineItems}
            totals={totals}
            onAddLine={handleAddLine}
            onChargeChange={(field, value) =>
              updateSectionField("charges", field, value)
            }
            onChargeBlur={(field) => markTouched("charges", field)}
            onDuplicateLine={handleDuplicateLine}
            onLineBlur={handleLineBlur}
            onRemoveLine={handleRemoveLine}
            onUpdateLine={handleUpdateLine}
          />
          <TradeTermsSection
            data={quotationForm.tradeTerms}
            errors={errors.tradeTerms}
            onBlur={(field) => markTouched("tradeTerms", field)}
            onInputChange={(field, value) =>
              updateSectionField("tradeTerms", field, value)
            }
          />
          <QuotationRemarksSection
            data={quotationForm.remarks}
            onInputChange={(field, value) =>
              updateSectionField("remarks", field, value)
            }
          />
          <QuotationDocumentsSection
            documents={quotationForm.documents}
            onToggleDocument={handleToggleDocument}
          />
        </form>

        <QuotationMarginSidebar
          marginSnapshot={marginSnapshot}
          totals={totals}
          warnings={warnings}
        />
      </div>

      <QuotationStickyActionBar
        canPreview={canPreview}
        canSend={canSend}
        cancelTo={cancelTo}
        draftLabel={draftLabel}
        hasBlockingErrors={hasBlockingErrors}
        isSaving={isSaving}
        primaryLabel={primaryLabel}
        warnings={warnings}
        onDraftAttempt={() =>
          handleSubmitAttempt({ destination: "detail", saveMode: "draft" })
        }
        onPreviewAttempt={
          previewEnabled
            ? () => handleSubmitAttempt({ destination: "preview", saveMode: "draft" })
            : undefined
        }
        onSubmitAttempt={() =>
          handleSubmitAttempt({ destination: "detail", saveMode: "send" })
        }
      />
    </div>
  );
};

export default QuotationFormLayout;
