import { initialLeadFormState } from "../constants/leadFormDefaults";

const toStringValue = (value) =>
  value === null || value === undefined ? "" : String(value);

const toLocalDateInput = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const scoreToInitialScore = (scoreLabel) => {
  const normalized = toStringValue(scoreLabel).toLowerCase();

  return ["hot", "warm", "cold"].includes(normalized) ? normalized : "warm";
};

export const mapLeadToLeadForm = (lead = {}) => ({
  ...initialLeadFormState,
  contact: {
    firstName: toStringValue(lead.firstName),
    lastName: toStringValue(lead.lastName),
    companyName: toStringValue(lead.companyName),
    designation: toStringValue(lead.designation),
    email: toStringValue(lead.email),
    phone: toStringValue(lead.phone),
    country: toStringValue(lead.country),
    city: toStringValue(lead.city),
  },
  chemicalRequirements: {
    chemicals: Array.isArray(lead.chemicals) ? lead.chemicals : [],
    gradeSpecification: toStringValue(lead.gradeSpecification),
    quantity: toStringValue(lead.quantityRequired),
    unit: toStringValue(lead.unit) || initialLeadFormState.chemicalRequirements.unit,
    frequency:
      toStringValue(lead.frequency) ||
      initialLeadFormState.chemicalRequirements.frequency,
    pricePerUnit: toStringValue(lead.pricePerUnit),
    currency:
      toStringValue(lead.currency) ||
      initialLeadFormState.chemicalRequirements.currency,
    estimatedValue: toStringValue(lead.estimatedValue),
  },
  tradeTerms: {
    incoterms: lead.incoterm ? [lead.incoterm] : [],
    paymentTerms: Array.isArray(lead.paymentTerms) ? lead.paymentTerms : [],
    destinationPort: toStringValue(lead.portOfDestination),
    packaging: toStringValue(lead.packagingRequirement),
  },
  sourceAssignment: {
    source: toStringValue(lead.source),
    sourceDetail: toStringValue(lead.sourceDetail),
    assignedTo:
      toStringValue(lead.assignedTo) ||
      initialLeadFormState.sourceAssignment.assignedTo,
    initialStage:
      toStringValue(lead.initialStage) ||
      toStringValue(lead.status) ||
      initialLeadFormState.sourceAssignment.initialStage,
    initialScore: scoreToInitialScore(lead.scoreLabel),
  },
  followUp: {
    date: toLocalDateInput(lead.followupDate),
    time: toStringValue(lead.followupTime).slice(0, 5),
    via: toStringValue(lead.followupVia) || initialLeadFormState.followUp.via,
    notes: toStringValue(lead.notes),
  },
  metadata: {
    mode: "edit",
    draftId: null,
    restoredFromDraft: false,
  },
});
