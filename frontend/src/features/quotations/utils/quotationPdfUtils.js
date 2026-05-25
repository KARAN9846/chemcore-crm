import {
  formatQuotationDate,
  formatQuotationMoney,
} from "./quotationDisplayUtils";

const defaultCompany = {
  initials: "CC",
  name: "ChemCore Industries Pvt Ltd",
  subtitle: "Chemical Exporter",
  address: "Vadodara, Gujarat, India",
  gst: "GST details on file",
  iec: "IEC details on file",
  email: "sales@chemcore.com",
  phone: "+91 98765 43210",
  cin: "CIN details on file",
};

export const getQuotationCompanyProfile = () => {
  try {
    const onboardingData = JSON.parse(
      localStorage.getItem("onboardingData") || "{}",
    );
    const company = onboardingData.company || onboardingData.step1 || {};
    const branding = onboardingData.branding || {};
    const name =
      company.companyName ||
      company.name ||
      branding.companyName ||
      defaultCompany.name;

    return {
      ...defaultCompany,
      initials: name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join("") || defaultCompany.initials,
      name,
      subtitle: company.businessType || company.industry || defaultCompany.subtitle,
      address:
        [company.address, company.city, company.state, company.country]
          .filter(Boolean)
          .join(", ") || defaultCompany.address,
      gst: company.gst || company.gstin || defaultCompany.gst,
      iec: company.iec || defaultCompany.iec,
      email: company.email || defaultCompany.email,
      phone: company.phone || company.mobile || defaultCompany.phone,
      cin: company.cin || defaultCompany.cin,
    };
  } catch {
    return defaultCompany;
  }
};

export const getSelectedQuotationDocuments = (quotation = {}) => {
  const documents = quotation.metadata?.documents;

  if (!Array.isArray(documents)) {
    return [];
  }

  return documents
    .map((document) => {
      if (typeof document === "string") {
        return { id: document, label: document, included: true };
      }

      return {
        id: document.id || document.label || document.name,
        label: document.label || document.name || document.id,
        included: document.included ?? document.selected ?? true,
      };
    })
    .filter((document) => document.included && (document.id || document.label));
};

export const getPrimaryQuotationSummary = ({ items = [], quotation = {} }) => {
  const primaryItem = items[0];
  const chemical = primaryItem?.chemicalName || "Quotation items";
  const quantity = primaryItem?.quantity
    ? `${primaryItem.quantity} ${primaryItem.unit || ""}`.trim()
    : "";

  return [
    quotation.companyName || quotation.clientName,
    [chemical, quantity].filter(Boolean).join(" "),
    formatQuotationMoney(quotation.grandTotal, quotation.currency),
  ]
    .filter(Boolean)
    .join(" - ");
};

export const getQuotationPdfFilename = (quotation = {}) =>
  `${quotation.quotationNumber || "quotation"}.pdf`;

export const withPdfDocumentTitle = (quotation, callback) => {
  const previousTitle = document.title;
  document.title = getQuotationPdfFilename(quotation);
  callback();

  window.setTimeout(() => {
    document.title = previousTitle;
  }, 500);
};

const getVersionNumberFromValue = (value) => {
  if (value && typeof value === "object") {
    return (
      value.versionNumber ??
      value.sourceVersionNumber ??
      value.revisedFromVersion ??
      null
    );
  }

  return typeof value === "number" ? value : null;
};

export const getQuotationVersionLabel = (quotation = {}) => {
  const metadata = quotation?.metadata ?? {};
  const versionValue = metadata.version ?? metadata.revision;

  if (typeof versionValue === "string") {
    return versionValue;
  }

  const versionNumber =
    quotation?.versionNumber ??
    getVersionNumberFromValue(versionValue) ??
    getVersionNumberFromValue(metadata.versionLabel) ??
    1;

  return `v${versionNumber}`;
};

export const formatPdfDate = (value) => formatQuotationDate(value);

export const formatPdfMoney = (value, currency) =>
  formatQuotationMoney(value, currency);
