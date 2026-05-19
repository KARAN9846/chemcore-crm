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

const quotationDetailQuerySchema = z
  .object({
    companyId: z.coerce.number().int().positive("Company ID is required"),
    publicId: z.string().uuid("Invalid quotation ID"),
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
