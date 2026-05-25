export const quotationClients = [
  {
    id: "alkhatib",
    label: "Mohammed Al Khatib - Al Khatib Trading (Kuwait)",
    name: "Mohammed Al Khatib",
    company: "Al Khatib Trading WLL",
    email: "mohammed@alkhatibtrading.com",
    country: "Kuwait",
  },
  {
    id: "grupo",
    label: "Carlos Rivera - Grupo Quimico SA (Brazil)",
    name: "Carlos Rivera",
    company: "Grupo Quimico SA",
    email: "carlos@grupoquimico.com",
    country: "Brazil",
  },
  {
    id: "chemtrex",
    label: "Nguyen Thi Lan - Chemtrex Vietnam",
    name: "Nguyen Thi Lan",
    company: "Chemtrex Vietnam Co. Ltd",
    email: "lan@chemtrex.vn",
    country: "Vietnam",
  },
  {
    id: "petrochem",
    label: "Tariq Hassan - Petrochem Egypt",
    name: "Tariq Hassan",
    company: "Petrochem Egypt LLC",
    email: "tariq@petrochemegypt.com",
    country: "Egypt",
  },
  {
    id: "ptmaju",
    label: "Budi Santoso - PT Maju Jaya (Indonesia)",
    name: "Budi Santoso",
    company: "PT Maju Jaya",
    email: "budi@ptmajujaya.co.id",
    country: "Indonesia",
  },
];

export const quotationChemicals = [
  "Caustic Soda",
  "Soda Ash",
  "Nitrocellulose",
  "Alkyd Resin",
  "Ammonium Nitrate",
];

export const quotationDocuments = [
  { id: "coa", label: "COA (Certificate of Analysis)", selected: true },
  { id: "msds", label: "MSDS / SDS", selected: true },
  { id: "origin", label: "Certificate of Origin", selected: false },
  { id: "fumigation", label: "Fumigation Certificate", selected: false },
  { id: "packing", label: "Packing List", selected: false },
  { id: "bol", label: "Bill of Lading", selected: false },
];

export const createEmptyLineItem = () => ({
  id: crypto.randomUUID(),
  chemical: "",
  grade: "",
  quantity: "",
  unit: "MT",
  unitPrice: "",
  supplierCost: "",
  freight: "",
});

const getTodayInputDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const createQuotationReferencePlaceholder = () => "";

export const createEmptyQuotationState = () => ({
  client: {
    leadId: "",
    name: "",
    company: "",
    email: "",
    country: "",
  },
  quotationInfo: {
    reference: createQuotationReferencePlaceholder(),
    currency: "USD",
    quotationDate: getTodayInputDate(),
    validUntil: "",
  },
  lineItems: [createEmptyLineItem()],
  charges: {
    freight: "",
    otherCharges: "",
    discountType: "pct",
    discount: "",
  },
  tradeTerms: {
    incoterm: "",
    loadingPort: "",
    destinationPort: "",
    paymentTerm: "",
    packaging: "",
    deliveryTimeline: "",
  },
  remarks: {
    clientRemarks: "",
    internalNotes: "",
  },
  documents: quotationDocuments,
  totals: {},
  metadata: {
    mode: "create",
    draftStatus: "ready",
    sourceLeadId: null,
  },
});

export const createQuotationStateFromPrefill = (initialData = {}) => {
  const emptyState = createEmptyQuotationState();
  const paymentTerm = Array.isArray(initialData.tradeTerms?.paymentTerms)
    ? initialData.tradeTerms.paymentTerms.filter(Boolean).join(", ")
    : initialData.tradeTerms?.paymentTerms;

  return {
    ...emptyState,
    client: {
      ...emptyState.client,
      ...initialData.client,
      leadId:
        initialData.client?.leadId ??
        initialData.client?.leadPublicId ??
        emptyState.client.leadId,
      name:
        initialData.client?.name ??
        initialData.client?.clientName ??
        emptyState.client.name,
      company:
        initialData.client?.company ??
        initialData.client?.companyName ??
        emptyState.client.company,
      email:
        initialData.client?.email ??
        initialData.client?.clientEmail ??
        emptyState.client.email,
    },
    quotationInfo: {
      ...emptyState.quotationInfo,
      ...initialData.quotationInfo,
      reference:
        initialData.quotationInfo?.reference ??
        initialData.quotationInfo?.quotationNumber ??
        emptyState.quotationInfo.reference,
      validUntil:
        initialData.quotationInfo?.validUntil ??
        initialData.quotationInfo?.validityDate ??
        initialData.quotationInfo?.validUntilDate ??
        emptyState.quotationInfo.validUntil,
    },
    lineItems: initialData.lineItems?.length
      ? initialData.lineItems.map((item) => ({
          ...createEmptyLineItem(),
          ...item,
          id: item.id ?? crypto.randomUUID(),
          chemical: item.chemical ?? item.chemicalName ?? "",
          grade: item.grade ?? item.gradeSpec ?? "",
          freight: item.freight ?? item.freightCost ?? "",
        }))
      : emptyState.lineItems,
    charges: {
      ...emptyState.charges,
      ...initialData.charges,
      freight:
        initialData.charges?.freight ??
        initialData.charges?.freightTotal ??
        emptyState.charges.freight,
      otherCharges:
        initialData.charges?.otherCharges ??
        initialData.charges?.additionalCharges ??
        emptyState.charges.otherCharges,
      discount:
        initialData.charges?.discount ??
        initialData.charges?.discountTotal ??
        emptyState.charges.discount,
    },
    tradeTerms: {
      ...emptyState.tradeTerms,
      ...initialData.tradeTerms,
      loadingPort:
        initialData.tradeTerms?.loadingPort ??
        initialData.tradeTerms?.portOfLoading ??
        emptyState.tradeTerms.loadingPort,
      destinationPort:
        initialData.tradeTerms?.destinationPort ??
        initialData.tradeTerms?.dischargePort ??
        initialData.tradeTerms?.portOfDestination ??
        emptyState.tradeTerms.destinationPort,
      paymentTerm:
        initialData.tradeTerms?.paymentTerm ??
        paymentTerm ??
        emptyState.tradeTerms.paymentTerm,
      packaging:
        initialData.tradeTerms?.packaging ??
        initialData.tradeTerms?.packagingDetails ??
        emptyState.tradeTerms.packaging,
    },
    remarks: {
      ...emptyState.remarks,
      ...initialData.remarks,
      clientRemarks:
        initialData.remarks?.clientRemarks ??
        initialData.remarks?.remarks ??
        emptyState.remarks.clientRemarks,
    },
    documents: initialData.documents ?? emptyState.documents,
    metadata: {
      ...emptyState.metadata,
      ...initialData.metadata,
      mode: initialData.metadata?.mode ?? "create",
    },
  };
};

export const createQuotationStateFromDetail = (detail, metadata = {}) => {
  const quotation = detail?.quotation ?? {};
  const lead = detail?.lead;
  const documents = Array.isArray(quotation.metadata?.documents)
    ? quotation.metadata.documents
    : undefined;

  return createQuotationStateFromPrefill({
    client: {
      leadId: lead?.publicId ?? "",
      name: quotation.clientName,
      company: quotation.companyName,
      email: quotation.clientEmail,
      country: quotation.country,
    },
    quotationInfo: {
      reference: quotation.quotationNumber,
      currency: quotation.currency,
      quotationDate: quotation.quotationDate,
      validUntil: quotation.validUntil,
    },
    lineItems: (detail?.items ?? []).map((item) => ({
      chemical: item.chemicalName,
      grade: item.gradeSpec,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      supplierCost: item.supplierCost,
      freight: item.freightCost,
    })),
    charges: {
      freight: quotation.freightTotal,
      otherCharges: quotation.additionalCharges,
      discount: quotation.discountTotal,
      discountType: quotation.metadata?.discountType ?? "amount",
    },
    tradeTerms: {
      incoterm: quotation.incoterm,
      loadingPort: quotation.loadingPort,
      destinationPort: quotation.dischargePort,
      paymentTerm: quotation.paymentTerms,
      packaging: quotation.packagingDetails,
    },
    remarks: {
      clientRemarks: quotation.remarks,
      internalNotes: quotation.internalNotes,
    },
    documents,
    metadata: {
      ...quotation.metadata,
      ...metadata,
      mode: metadata.mode ?? "revise",
      sourceQuotationPublicId: quotation.publicId,
      sourceVersionNumber: quotation.versionNumber ?? 1,
    },
  });
};

export const initialQuotationState = createEmptyQuotationState();
