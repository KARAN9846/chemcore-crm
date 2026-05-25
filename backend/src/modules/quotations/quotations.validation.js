import { z } from "zod";
import {
  normalizeQuotationInput,
  quotationSchema,
} from "../../../../shared/validation/quotation.schema.js";

const createQuotationRequestSchema = z
  .object({
    companyId: z.coerce.number().int().positive("Company ID is required"),
    quotationForm: z.unknown(),
  })
  .strict();

const reviseQuotationRequestSchema = z
  .object({
    companyId: z.coerce.number().int().positive("Company ID is required"),
    publicId: z.string().uuid("Invalid quotation ID"),
    quotationForm: z.unknown(),
    revisionNotes: z.string().trim().max(1000).optional().default(""),
    saveMode: z.enum(["draft", "send"]).optional().default("draft"),
  })
  .strict();

const quotationDetailQuerySchema = z
  .object({
    companyId: z.coerce.number().int().positive("Company ID is required"),
    publicId: z.string().uuid("Invalid quotation ID"),
  })
  .strict();

const positiveIntWithDefault = (defaultValue, maxValue) =>
  z.preprocess((value) => {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1) {
      return defaultValue;
    }

    return Math.min(parsed, maxValue);
  }, z.number().int().min(1).max(maxValue).default(defaultValue));

const quotationListQuerySchema = z
  .object({
    companyId: z.coerce.number().int().positive("Company ID is required"),
    page: positiveIntWithDefault(1, 100000),
    limit: positiveIntWithDefault(10, 100),
    search: z.string().trim().optional().default(""),
    status: z.string().trim().optional().default(""),
    owner: z.string().trim().optional().default(""),
    chemical: z.string().trim().optional().default(""),
    sortBy: z
      .enum(["createdAt", "quotationDate", "validUntil", "value", "margin", "client"])
      .optional()
      .default("quotationDate"),
    sortDir: z.enum(["asc", "desc"]).optional().default("desc"),
  })
  .strict();

const quotationCompareQuerySchema = z
  .object({
    companyId: z.coerce.number().int().positive("Company ID is required"),
    publicId: z.string().uuid("Invalid quotation ID"),
    v1: z.string().trim().optional().default("current"),
    v2: z.string().trim().optional().default("v1"),
  })
  .strict();

const formatIssues = (issues = []) =>
  issues.map((issue) => ({
    field: issue.path.join(".") || "form",
    message: issue.message,
  }));

export const validateCreateQuotationPayload = (body = {}) => {
  const requestResult = createQuotationRequestSchema.safeParse(body);

  if (!requestResult.success) {
    return {
      success: false,
      errors: formatIssues(requestResult.error.issues),
    };
  }

  const normalizedQuotation = normalizeQuotationInput(
    requestResult.data.quotationForm,
  );
  const quotationResult = quotationSchema.safeParse(normalizedQuotation);

  if (!quotationResult.success) {
    return {
      success: false,
      errors: formatIssues(quotationResult.error.issues),
    };
  }

  return {
    success: true,
    data: {
      companyId: requestResult.data.companyId,
      quotationForm: quotationResult.data,
    },
  };
};

export const validateQuotationDetailQuery = ({ params = {}, query = {} }) => {
  const result = quotationDetailQuerySchema.safeParse({
    publicId: params.publicId,
    companyId: query.companyId,
  });

  if (!result.success) {
    return {
      success: false,
      errors: formatIssues(result.error.issues),
    };
  }

  return {
    success: true,
    data: result.data,
  };
};

export const validateReviseQuotationPayload = ({ body = {}, params = {} }) => {
  const requestResult = reviseQuotationRequestSchema.safeParse({
    ...body,
    publicId: params.publicId,
  });

  if (!requestResult.success) {
    return {
      success: false,
      errors: formatIssues(requestResult.error.issues),
    };
  }

  const normalizedQuotation = normalizeQuotationInput(
    requestResult.data.quotationForm,
  );
  const quotationResult = quotationSchema.safeParse(normalizedQuotation);

  if (!quotationResult.success) {
    return {
      success: false,
      errors: formatIssues(quotationResult.error.issues),
    };
  }

  return {
    success: true,
    data: {
      companyId: requestResult.data.companyId,
      publicId: requestResult.data.publicId,
      quotationForm: quotationResult.data,
      revisionNotes: requestResult.data.revisionNotes,
      saveMode: requestResult.data.saveMode,
    },
  };
};

export const validateQuotationListQuery = (query = {}) => {
  const result = quotationListQuerySchema.safeParse(query);

  if (!result.success) {
    return {
      success: false,
      errors: formatIssues(result.error.issues),
    };
  }

  return {
    success: true,
    data: result.data,
  };
};

export const validateQuotationDeleteQuery = ({ params = {}, query = {} }) =>
  validateQuotationDetailQuery({ params, query });

export const validateQuotationCompareQuery = ({ params = {}, query = {} }) => {
  const result = quotationCompareQuerySchema.safeParse({
    publicId: params.publicId,
    companyId: query.companyId,
    v1: query.v1,
    v2: query.v2,
  });

  if (!result.success) {
    return {
      success: false,
      errors: formatIssues(result.error.issues),
    };
  }

  return {
    success: true,
    data: result.data,
  };
};
