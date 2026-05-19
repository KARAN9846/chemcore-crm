import { z } from "zod";

const clean = (value) => (typeof value === "string" ? value.trim() : value);

const textValue = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(textValue).filter(Boolean).join(", ");
  }

  if (value && typeof value === "object") {
    return clean(value.value ?? value.label ?? value.name ?? value.term ?? "");
  }

  return clean(value ?? "");
};

const requiredString = (message, max = 255) =>
  z
    .string()
    .transform(clean)
    .pipe(z.string().min(1, message).max(max));

const optionalString = (max = 255) =>
  z
    .union([z.string(), z.null(), z.undefined()])
    .transform((value) => {
      const cleaned = clean(value);
      return cleaned === "" || cleaned === undefined ? null : cleaned;
    })
    .pipe(z.union([z.string().max(max), z.null()]));

const numericString = (message) =>
  z
    .union([z.string(), z.number()])
    .transform((value) => clean(String(value ?? "")))
    .pipe(z.string().min(1, message))
    .refine((value) => Number.isFinite(Number(value)), message)
    .refine((value) => Number(value) >= 0, "Value cannot be negative");

const optionalNumericString = (message) =>
  z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((value) => clean(String(value ?? "")))
    .refine(
      (value) => value === "" || Number.isFinite(Number(value)),
      message,
    )
    .refine(
      (value) => value === "" || Number(value) >= 0,
      "Value cannot be negative",
    );

const validDateString = (message) =>
  requiredString(message, 20).refine((value) => {
    const date = new Date(`${value}T00:00:00`);

    return !Number.isNaN(date.getTime());
  }, message);

const isSameOrAfter = (endDate, startDate) => {
  const end = new Date(`${endDate}T00:00:00`);
  const start = new Date(`${startDate}T00:00:00`);

  return end >= start;
};

export const normalizeQuotationNumber = (value) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const normalizeQuotationInput = (input = {}) => ({
  client: {
    leadId: textValue(input.client?.leadId ?? input.client?.leadPublicId ?? ""),
    name: textValue(input.client?.name ?? input.client?.clientName ?? ""),
    company: textValue(input.client?.company ?? input.client?.companyName ?? ""),
    email: textValue(input.client?.email ?? input.client?.clientEmail ?? ""),
    country: textValue(input.client?.country ?? ""),
  },
  quotationInfo: {
    reference: textValue(
      input.quotationInfo?.reference ??
        input.quotationInfo?.quotationNumber ??
        "",
    ),
    currency: textValue(input.quotationInfo?.currency ?? ""),
    quotationDate: textValue(
      input.quotationInfo?.quotationDate ?? input.quotationInfo?.quoteDate ?? "",
    ),
    validUntil: textValue(
      input.quotationInfo?.validUntil ??
        input.quotationInfo?.validityDate ??
        input.quotationInfo?.validUntilDate ??
        "",
    ),
  },
  lineItems: (input.lineItems ?? []).map((item) => ({
    id: textValue(item.id ?? ""),
    chemical: textValue(item.chemical ?? item.chemicalName ?? ""),
    grade: textValue(item.grade ?? item.gradeSpec ?? ""),
    quantity: textValue(item.quantity ?? ""),
    unit: textValue(item.unit ?? ""),
    unitPrice: textValue(item.unitPrice ?? ""),
    supplierCost: textValue(item.supplierCost ?? ""),
    freight: textValue(item.freight ?? item.freightCost ?? ""),
  })),
  charges: {
    freight: textValue(input.charges?.freight ?? input.charges?.freightTotal ?? ""),
    otherCharges: textValue(
      input.charges?.otherCharges ?? input.charges?.additionalCharges ?? "",
    ),
    discountType: textValue(input.charges?.discountType ?? "pct"),
    discount: textValue(input.charges?.discount ?? input.charges?.discountTotal ?? ""),
  },
  tradeTerms: {
    incoterm: textValue(input.tradeTerms?.incoterm ?? ""),
    loadingPort: textValue(
      input.tradeTerms?.loadingPort ?? input.tradeTerms?.portOfLoading ?? "",
    ),
    destinationPort: textValue(
      input.tradeTerms?.destinationPort ??
        input.tradeTerms?.dischargePort ??
        input.tradeTerms?.portOfDestination ??
        "",
    ),
    paymentTerm: textValue(
      input.tradeTerms?.paymentTerm ?? input.tradeTerms?.paymentTerms ?? "",
    ),
    packaging: textValue(
      input.tradeTerms?.packaging ?? input.tradeTerms?.packagingDetails ?? "",
    ),
    deliveryTimeline: textValue(input.tradeTerms?.deliveryTimeline ?? ""),
  },
  remarks: {
    clientRemarks: textValue(
      input.remarks?.clientRemarks ?? input.remarks?.remarks ?? "",
    ),
    internalNotes: textValue(input.remarks?.internalNotes ?? ""),
  },
  documents: Array.isArray(input.documents) ? input.documents : [],
  totals: input.totals ?? {},
  metadata: input.metadata ?? {},
});

const lineItemSchema = z
  .object({
    id: optionalString(80),
    chemical: requiredString("Chemical is required", 120),
    grade: optionalString(180),
    quantity: numericString("Quantity is required"),
    unit: requiredString("Unit is required", 20),
    unitPrice: numericString("Unit price is required"),
    supplierCost: numericString("Supplier cost is required"),
    freight: optionalNumericString("Freight must be numeric"),
  })
  .strict()
  .superRefine((item, ctx) => {
    const quantity = normalizeQuotationNumber(item.quantity);
    const unitPrice = normalizeQuotationNumber(item.unitPrice);

    if (quantity <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quantity"],
        message: "Quantity must be greater than 0",
      });
    }

    if (unitPrice <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["unitPrice"],
        message: "Unit price must be greater than 0",
      });
    }
  });

export const quotationSchema = z
  .object({
    client: z
      .object({
        leadId: optionalString(80),
        name: requiredString("Client name is required", 120),
        company: requiredString("Client company is required", 160),
        email: requiredString("Client email is required", 255).pipe(
          z.string().email("Enter a valid email"),
        ),
        country: requiredString("Country is required", 80),
      })
      .strict(),
    quotationInfo: z
      .object({
        reference: optionalString(80),
        currency: requiredString("Currency is required", 10),
        quotationDate: validDateString("Quotation date is required"),
        validUntil: validDateString("Validity date is required"),
      })
      .strict(),
    lineItems: z.array(lineItemSchema).min(1, "At least one line item is required"),
    charges: z
      .object({
        freight: optionalNumericString("Freight must be numeric"),
        otherCharges: optionalNumericString("Other charges must be numeric"),
        discountType: z.enum(["pct", "flat"]).default("pct"),
        discount: optionalNumericString("Discount must be numeric"),
      })
      .strict(),
    tradeTerms: z
      .object({
        incoterm: requiredString("Incoterm is required", 40),
        loadingPort: requiredString("Port of loading is required", 120),
        destinationPort: optionalString(120),
        paymentTerm: requiredString("Payment terms are required", 120),
        packaging: requiredString("Packaging is required", 160),
        deliveryTimeline: optionalString(160),
      })
      .strict(),
    remarks: z
      .object({
        clientRemarks: optionalString(1200),
        internalNotes: optionalString(1200),
      })
      .strict(),
    documents: z.array(
      z
        .object({
          id: requiredString("Document ID is required", 80),
          label: requiredString("Document label is required", 160),
          selected: z.boolean().default(false),
        })
        .strict(),
    ),
    totals: z
      .object({
        grandTotal: z.number().optional(),
        marginPercent: z.number().optional(),
        grossProfit: z.number().optional(),
      })
      .passthrough()
      .optional(),
    metadata: z.object({}).passthrough().optional(),
  })
  .strict()
  .superRefine((quote, ctx) => {
    if (!isSameOrAfter(
      quote.quotationInfo.validUntil,
      quote.quotationInfo.quotationDate,
    )) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quotationInfo", "validUntil"],
        message: "Validity date cannot be before quotation date",
      });
    }

    const subtotal = quote.lineItems.reduce(
      (total, item) =>
        total +
        normalizeQuotationNumber(item.quantity) *
          normalizeQuotationNumber(item.unitPrice),
      0,
    );
    const discount = normalizeQuotationNumber(quote.charges.discount);
    const discountAmount =
      quote.charges.discountType === "pct" ? subtotal * (discount / 100) : discount;
    const grandTotal =
      subtotal +
      normalizeQuotationNumber(quote.charges.freight) +
      normalizeQuotationNumber(quote.charges.otherCharges) -
      discountAmount;

    if (quote.charges.discountType === "pct" && discount > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["charges", "discount"],
        message: "Discount percentage cannot exceed 100%",
      });
    }

    if (grandTotal <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["charges", "discount"],
        message: "Quotation total must be greater than 0",
      });
    }
  });
