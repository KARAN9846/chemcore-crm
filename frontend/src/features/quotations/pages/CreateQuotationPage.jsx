import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  createQuotation,
  getLeadOptionsForQuotation,
} from "../api/quotations.api";
import QuotationStickyActionBar from "../components/common/QuotationStickyActionBar";
import QuotationLineItemsSection from "../components/sections/QuotationLineItemsSection";
import ClientDetailsSection from "../components/sections/ClientDetailsSection";
import QuotationDocumentsSection from "../components/sections/QuotationDocumentsSection";
import QuotationRemarksSection from "../components/sections/QuotationRemarksSection";
import TradeTermsSection from "../components/sections/TradeTermsSection";
import QuotationMarginSidebar from "../components/sidebar/QuotationMarginSidebar";
import {
  createEmptyLineItem,
  createQuotationStateFromPrefill,
} from "../constants/quotationDefaults";
import { getQuotationTotals } from "../utils/quotationCalculations";
import { getQuotationMarginSnapshot } from "../utils/quotationMarginUtils";
import {
  getTouchedQuotationErrors,
  getValidatedQuotationPayload,
  getQuotationWarnings,
  hasTouchedQuotationFields,
  validateQuotationForm,
} from "../utils/quotationValidation";
import { getCompanyId } from "../../../utils/company";
import { showError, showSuccess, showValidationWarning } from "../../../utils/toast";

const MIN_SUBMIT_LOCK_MS = 1500;

const CreateQuotationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quotationForm, setQuotationForm] = useState(() =>
    createQuotationStateFromPrefill(state?.quotationPrefill),
  );
  const [leadOptions, setLeadOptions] = useState([]);
  const [isLoadingLeadOptions, setIsLoadingLeadOptions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const submitLockRef = useRef(false);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

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

  const handleSubmitAttempt = useCallback(async () => {
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
      const response = await createQuotation({
        companyId,
        quotationForm: validation.data,
      });
      showSuccess(response.message || "Quotation created successfully");
      navigate(`/dashboard/quotations/${response.data.publicId}`, {
        state: { quotation: response.data },
      });
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.duplicate) {
        showError(responseData.message || "Quotation number already exists");
      } else {
        showError(responseData?.message || "Failed to create quotation");
      }
    } finally {
      const elapsed = Date.now() - lockStartedAt;
      const remainingLock = Math.max(0, MIN_SUBMIT_LOCK_MS - elapsed);

      window.setTimeout(() => {
        submitLockRef.current = false;
        setIsSaving(false);
      }, remainingLock);
    }
  }, [navigate, quotationForm, totals]);

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
          <span>New Quotation</span>
        </nav>
        <span className="quotation-draft-note">
          <i className="bi bi-info-circle" aria-hidden="true"></i>
          Draft workflow ready for autosave
        </span>
      </div>

      <div className="lead-page-header">
        <div>
          <h2>Create Quotation</h2>
          <p>Prepare client pricing, trade terms, margin review, and document references.</p>
        </div>
      </div>

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

        <QuotationMarginSidebar totals={totals} />
      </div>

      <QuotationStickyActionBar
        canPreview={canPreview}
        canSend={canSend}
        hasBlockingErrors={hasBlockingErrors}
        isSaving={isSaving}
        warnings={warnings}
        onSubmitAttempt={handleSubmitAttempt}
      />
    </div>
  );
};

export default CreateQuotationPage;
