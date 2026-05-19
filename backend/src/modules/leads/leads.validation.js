import { z } from "zod";
import {
  leadSchema,
  normalizeLeadInput,
} from "../../../../shared/validation/lead.schema.js";

const intelligenceSchema = z
  .object({
    score: z.number().min(0).max(100).optional(),
    status: z.enum(["Cold", "Warm", "Hot"]).optional(),
  })
  .optional();

const createLeadRequestSchema = z
  .object({
    companyId: z.coerce.number().int().positive("Company ID is required"),
    leadForm: z.unknown(),
    intelligence: intelligenceSchema,
    continueAnyway: z.boolean().optional(),
  })
  .strict();

const updateLeadRequestSchema = z
  .object({
    companyId: z.coerce.number().int().positive("Company ID is required"),
    leadForm: z.unknown(),
    intelligence: intelligenceSchema,
  })
  .strict();

const leadListQuerySchema = z
  .object({
    companyId: z.coerce.number().int().positive("Company ID is required"),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().optional().default(""),
    status: z
      .enum(["new", "qualified", "quoted", "negotiating", "converted", "lost"])
      .optional(),
    sortBy: z
      .enum(["createdAt", "companyName", "score", "followUp", "value"])
      .optional()
      .default("createdAt"),
    sortDir: z.enum(["asc", "desc"]).optional().default("desc"),
    dateFrom: z.string().trim().optional(),
    dateTo: z.string().trim().optional(),
    scoreMin: z.coerce.number().int().min(0).max(100).optional(),
    scoreMax: z.coerce.number().int().min(0).max(100).optional(),
  })
  .strict();

const leadDetailQuerySchema = z
  .object({
    companyId: z.coerce.number().int().positive("Company ID is required"),
    publicId: z.string().uuid("Invalid lead ID"),
  })
  .strict();

const leadOptionsQuerySchema = z
  .object({
    companyId: z.coerce.number().int().positive("Company ID is required"),
  })
  .strict();

const followupPayloadSchema = z
  .object({
    companyId: z.coerce.number().int().positive("Company ID is required"),
    followup: z
      .object({
        date: z.string().trim().min(1, "Follow-up date is required"),
        time: z.string().trim().optional().default(""),
        via: z.string().trim().min(1, "Follow-up channel is required"),
        note: z.string().trim().max(500).optional().default(""),
      })
      .strict(),
  })
  .strict();

export const validateCreateLeadPayload = (body = {}) => {
  const requestResult = createLeadRequestSchema.safeParse(body);

  if (!requestResult.success) {
    return {
      success: false,
      errors: requestResult.error.issues.map((issue) => ({
        field: issue.path.join(".") || "form",
        message: issue.message,
      })),
    };
  }

  const normalizedLead = normalizeLeadInput(requestResult.data.leadForm);
  const leadResult = leadSchema.safeParse(normalizedLead);

  if (!leadResult.success) {
    return {
      success: false,
      errors: leadResult.error.issues.map((issue) => ({
        field: issue.path.join(".") || "form",
        message: issue.message,
      })),
    };
  }

  return {
    success: true,
    data: {
      companyId: requestResult.data.companyId,
      leadForm: leadResult.data,
      intelligence: requestResult.data.intelligence ?? {},
      continueAnyway: Boolean(requestResult.data.continueAnyway),
    },
  };
};

export const validateUpdateLeadPayload = ({ params = {}, body = {} }) => {
  const requestResult = updateLeadRequestSchema.safeParse(body);

  if (!requestResult.success) {
    return {
      success: false,
      errors: requestResult.error.issues.map((issue) => ({
        field: issue.path.join(".") || "form",
        message: issue.message,
      })),
    };
  }

  const publicIdResult = z.string().uuid("Invalid lead ID").safeParse(params.publicId);

  if (!publicIdResult.success) {
    return {
      success: false,
      errors: [
        {
          field: "publicId",
          message: "Invalid lead ID",
        },
      ],
    };
  }

  const normalizedLead = normalizeLeadInput(requestResult.data.leadForm);
  const leadResult = leadSchema.safeParse(normalizedLead);

  if (!leadResult.success) {
    return {
      success: false,
      errors: leadResult.error.issues.map((issue) => ({
        field: issue.path.join(".") || "form",
        message: issue.message,
      })),
    };
  }

  return {
    success: true,
    data: {
      publicId: publicIdResult.data,
      companyId: requestResult.data.companyId,
      leadForm: leadResult.data,
      intelligence: requestResult.data.intelligence ?? {},
    },
  };
};

export const validateLeadListQuery = (query = {}) => {
  const result = leadListQuerySchema.safeParse(query);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "query",
        message: issue.message,
      })),
    };
  }

  return {
    success: true,
    data: result.data,
  };
};

export const validateLeadDetailQuery = ({ params = {}, query = {} }) => {
  const result = leadDetailQuerySchema.safeParse({
    publicId: params.publicId,
    companyId: query.companyId,
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "query",
        message: issue.message,
      })),
    };
  }

  return {
    success: true,
    data: result.data,
  };
};

export const validateLeadOptionsQuery = (query = {}) => {
  const result = leadOptionsQuerySchema.safeParse(query);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "query",
        message: issue.message,
      })),
    };
  }

  return {
    success: true,
    data: result.data,
  };
};

export const validateFollowupPayload = ({ params = {}, body = {} }) => {
  const result = followupPayloadSchema.safeParse(body);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "form",
        message: issue.message,
      })),
    };
  }

  const publicIdResult = z.string().uuid("Invalid lead ID").safeParse(params.publicId);

  if (!publicIdResult.success) {
    return {
      success: false,
      errors: [
        {
          field: "publicId",
          message: "Invalid lead ID",
        },
      ],
    };
  }

  return {
    success: true,
    data: {
      publicId: publicIdResult.data,
      companyId: result.data.companyId,
      followup: result.data.followup,
    },
  };
};
