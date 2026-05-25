import { normalizeQuotationNumber } from "../../../../shared/validation/quotation.schema.js";

const toNumber = normalizeQuotationNumber;

const calculateLine = (item) => {
  const quantity = toNumber(item.quantity);
  const unitPrice = toNumber(item.unitPrice);
  const supplierCost = toNumber(item.supplierCost);
  const freightCost = toNumber(item.freight);
  const lineTotal = quantity * unitPrice;
  const supplierTotal = quantity * supplierCost;
  const grossProfit = lineTotal - supplierTotal - freightCost;
  const marginPercent = lineTotal > 0 ? (grossProfit / lineTotal) * 100 : 0;

  return {
    quantity,
    unitPrice,
    supplierCost,
    freightCost,
    lineTotal,
    grossProfit,
    marginPercent,
  };
};

export const calculateQuotationTotals = (quotationForm) => {
  const lineSnapshots = quotationForm.lineItems.map(calculateLine);
  const subtotal = lineSnapshots.reduce((sum, item) => sum + item.lineTotal, 0);
  const lineFreight = lineSnapshots.reduce((sum, item) => sum + item.freightCost, 0);
  const supplierCost = lineSnapshots.reduce(
    (sum, item, index) =>
      sum + item.quantity * toNumber(quotationForm.lineItems[index].supplierCost),
    0,
  );
  const freightTotal = toNumber(quotationForm.charges.freight) + lineFreight;
  const additionalCharges = toNumber(quotationForm.charges.otherCharges);
  const discount = toNumber(quotationForm.charges.discount);
  const discountTotal =
    quotationForm.charges.discountType === "pct"
      ? subtotal * (discount / 100)
      : discount;
  const grandTotal = subtotal + freightTotal + additionalCharges - discountTotal;
  const totalCost = supplierCost + freightTotal;
  const grossProfit = grandTotal - totalCost;
  const marginPercent = grandTotal > 0 ? (grossProfit / grandTotal) * 100 : 0;

  return {
    subtotal,
    freightTotal,
    additionalCharges,
    discountTotal,
    grandTotal,
    grossProfit,
    marginPercent,
  };
};

export const mapCreateQuotationToDb = ({ companyId, quotationForm }) => {
  const totals = calculateQuotationTotals(quotationForm);

  return {
    quotation: {
      company_id: companyId,
      lead_id: null,
      lead_public_id: quotationForm.client.leadId || null,
      quotation_number: quotationForm.quotationInfo.reference || null,
      status: "Draft",
      quotation_date: quotationForm.quotationInfo.quotationDate,
      valid_until: quotationForm.quotationInfo.validUntil,
      currency: quotationForm.quotationInfo.currency,
      client_name: quotationForm.client.name,
      company_name: quotationForm.client.company,
      client_email: quotationForm.client.email,
      country: quotationForm.client.country,
      subtotal: totals.subtotal,
      freight_total: totals.freightTotal,
      additional_charges: totals.additionalCharges,
      discount_total: totals.discountTotal,
      grand_total: totals.grandTotal,
      gross_profit: totals.grossProfit,
      margin_percent: totals.marginPercent,
      incoterm: quotationForm.tradeTerms.incoterm,
      payment_terms: quotationForm.tradeTerms.paymentTerm,
      loading_port: quotationForm.tradeTerms.loadingPort,
      discharge_port: quotationForm.tradeTerms.destinationPort,
      packaging_details: quotationForm.tradeTerms.packaging,
      remarks: quotationForm.remarks.clientRemarks,
      internal_notes: quotationForm.remarks.internalNotes,
      metadata: {
        ...(quotationForm.metadata ?? {}),
        documents: quotationForm.documents ?? [],
        discountType: quotationForm.charges.discountType,
      },
      created_by: quotationForm.metadata?.createdBy ?? null,
    },
    items: quotationForm.lineItems.map((item, index) => {
      const line = calculateLine(item);

      return {
        chemical_name: item.chemical,
        grade_spec: item.grade,
        quantity: line.quantity,
        unit: item.unit,
        unit_price: line.unitPrice,
        supplier_cost: line.supplierCost,
        freight_cost: line.freightCost,
        line_total: line.lineTotal,
        gross_profit: line.grossProfit,
        margin_percent: line.marginPercent,
        sort_order: index,
        metadata: {
          sourceLineId: item.id ?? null,
        },
      };
    }),
  };
};

export const mapQuotationResponse = (row = {}) => ({
  publicId: row.public_id,
  quotationNumber: row.quotation_number,
  versionNumber: row.version_number ?? 1,
  parentQuotationId: row.parent_quotation_id,
  revisedFromId: row.revised_from_id,
  revisionNotes: row.revision_notes,
  isLatestVersion: row.is_latest_version ?? true,
  status: row.status,
  grandTotal: row.grand_total,
  currency: row.currency,
  createdAt: row.created_at,
});

export const mapQuotationListResponse = (row = {}) => ({
  publicId: row.public_id,
  quotationNumber: row.quotation_number,
  versionNumber: row.version_number ?? 1,
  isLatestVersion: row.is_latest_version ?? true,
  status: row.status,
  quotationDate: row.quotation_date,
  validUntil: row.valid_until,
  currency: row.currency,
  clientName: row.client_name,
  companyName: row.company_name,
  country: row.country,
  grandTotal: row.grand_total,
  marginPercent: row.margin_percent,
  incoterm: row.incoterm,
  createdBy: row.created_by,
  primaryChemical: row.primary_chemical,
  primaryGrade: row.primary_grade,
  primaryQuantity: row.primary_quantity,
  primaryUnit: row.primary_unit,
  primaryUnitPrice: row.primary_unit_price,
  itemCount: row.item_count ?? 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapQuotationDetailResponse = ({
  items = [],
  lead = null,
  quotation = {},
  versionHistory = [],
}) => ({
  quotation: {
    publicId: quotation.public_id,
    quotationNumber: quotation.quotation_number,
    versionNumber: quotation.version_number ?? 1,
    parentQuotationId: quotation.parent_quotation_id,
    revisedFromId: quotation.revised_from_id,
    revisionNotes: quotation.revision_notes,
    isLatestVersion: quotation.is_latest_version ?? true,
    status: quotation.status,
    quotationDate: quotation.quotation_date,
    validUntil: quotation.valid_until,
    currency: quotation.currency,
    clientName: quotation.client_name,
    companyName: quotation.company_name,
    clientEmail: quotation.client_email,
    country: quotation.country,
    subtotal: quotation.subtotal,
    freightTotal: quotation.freight_total,
    additionalCharges: quotation.additional_charges,
    discountTotal: quotation.discount_total,
    grandTotal: quotation.grand_total,
    grossProfit: quotation.gross_profit,
    marginPercent: quotation.margin_percent,
    incoterm: quotation.incoterm,
    paymentTerms: quotation.payment_terms,
    loadingPort: quotation.loading_port,
    dischargePort: quotation.discharge_port,
    packagingDetails: quotation.packaging_details,
    remarks: quotation.remarks,
    internalNotes: quotation.internal_notes,
    metadata: quotation.metadata ?? {},
    createdBy: quotation.created_by,
    createdAt: quotation.created_at,
    updatedAt: quotation.updated_at,
  },
  lead,
  versionHistory: versionHistory.map((version) => ({
    publicId: version.public_id,
    quotationNumber: version.quotation_number,
    versionNumber: version.version_number ?? 1,
    status: version.status,
    revisionNotes: version.revision_notes,
    isLatestVersion: version.is_latest_version ?? false,
    createdBy: version.created_by,
    createdAt: version.created_at,
    updatedAt: version.updated_at,
  })),
  items: items.map((item) => ({
    chemicalName: item.chemical_name,
    gradeSpec: item.grade_spec,
    quantity: item.quantity,
    unit: item.unit,
    unitPrice: item.unit_price,
    supplierCost: item.supplier_cost,
    freightCost: item.freight_cost,
    lineTotal: item.line_total,
    grossProfit: item.gross_profit,
    marginPercent: item.margin_percent,
    sortOrder: item.sort_order,
  })),
});
