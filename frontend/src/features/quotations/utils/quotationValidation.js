import {
  normalizeQuotationInput,
  quotationSchema,
} from "../../../../../shared/validation/quotation.schema.js";

export const buildQuotationErrors = (issues = []) =>
  issues.reduce((acc, issue) => {
    if (!issue.path.length) {
      return {
        ...acc,
        form: issue.message,
      };
    }

    const [section, field, nestedField] = issue.path;

    if (section === "lineItems" && typeof field === "number") {
      return {
        ...acc,
        lineItems: {
          ...acc.lineItems,
          [field]: {
            ...acc.lineItems?.[field],
            [nestedField || "row"]: issue.message,
          },
        },
      };
    }

    return {
      ...acc,
      [section]: {
        ...acc[section],
        [field]: acc[section]?.[field] || issue.message,
      },
    };
  }, {});

export const validateQuotationForm = (quotationForm, totals) => {
  const normalizedQuotation = normalizeQuotationInput({
    ...quotationForm,
    totals,
  });
  const result = quotationSchema.safeParse(normalizedQuotation);

  if (result.success) {
    return {};
  }

  return buildQuotationErrors(result.error.issues);
};

export const getValidatedQuotationPayload = (quotationForm, totals) => {
  const result = quotationSchema.safeParse(
    normalizeQuotationInput({
      ...quotationForm,
      totals,
    }),
  );

  return result.success
    ? { success: true, data: result.data, errors: {} }
    : { success: false, data: null, errors: buildQuotationErrors(result.error.issues) };
};

const getTouchedLineErrors = (lineErrors = {}, touchedLines = {}) =>
  Object.entries(lineErrors).reduce((acc, [index, fieldErrors]) => {
    const visibleFieldErrors = Object.entries(fieldErrors).reduce(
      (fieldAcc, [field, message]) =>
        touchedLines[index]?.[field]
          ? {
              ...fieldAcc,
              [field]: message,
            }
          : fieldAcc,
      {},
    );

    return Object.keys(visibleFieldErrors).length
      ? {
          ...acc,
          [index]: visibleFieldErrors,
        }
      : acc;
  }, {});

export const getTouchedQuotationErrors = (errors = {}, touched = {}) =>
  Object.entries(errors).reduce((acc, [section, sectionErrors]) => {
    if (section === "lineItems") {
      const lineItems = getTouchedLineErrors(sectionErrors, touched.lineItems);

      return Object.keys(lineItems).length ? { ...acc, lineItems } : acc;
    }

    if (!sectionErrors || typeof sectionErrors !== "object") {
      return touched[section] ? { ...acc, [section]: sectionErrors } : acc;
    }

    const visibleSectionErrors = Object.entries(sectionErrors).reduce(
      (sectionAcc, [field, message]) =>
        touched[section]?.[field]
          ? {
              ...sectionAcc,
              [field]: message,
            }
          : sectionAcc,
      {},
    );

    return Object.keys(visibleSectionErrors).length
      ? {
          ...acc,
          [section]: visibleSectionErrors,
        }
      : acc;
  }, {});

export const hasTouchedQuotationFields = (touched = {}) =>
  Object.values(touched).some((section) => {
    if (!section) {
      return false;
    }

    return Object.values(section).some((value) =>
      typeof value === "object" && value !== null
        ? Object.values(value).some(Boolean)
        : Boolean(value),
    );
  });

export const getQuotationWarnings = ({ quotationForm, marginSnapshot, totals }) => {
  const warnings = [];
  const validUntil = quotationForm.quotationInfo.validUntil
    ? new Date(`${quotationForm.quotationInfo.validUntil}T00:00:00`)
    : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (marginSnapshot.marginHealth === "loss") {
    warnings.push("Loss-making quotation detected. Review pricing before sending.");
  } else if (["low", "watch"].includes(marginSnapshot.marginHealth)) {
    warnings.push("Margin is below target. Commercial approval may be needed.");
  }

  if (!quotationForm.tradeTerms.incoterm) {
    warnings.push("Incoterm missing. This affects freight and risk responsibility.");
  }

  if (!quotationForm.tradeTerms.paymentTerm) {
    warnings.push("Payment terms missing. Quote may not be commercially complete.");
  }

  if (validUntil && validUntil < today) {
    warnings.push("Quotation validity date has expired.");
  }

  if (totals.discountAmount > totals.subtotal * 0.25) {
    warnings.push("High discount detected. Review margin before preview/send.");
  }

  return warnings;
};
