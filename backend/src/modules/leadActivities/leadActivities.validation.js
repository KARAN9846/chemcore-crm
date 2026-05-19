import { z } from "zod";
import {
  activitySchema,
  normalizeActivityInput,
} from "../../../../shared/validation/activity.schema.js";

const baseRequestSchema = z
  .object({
    companyId: z.coerce.number().int().positive("Company ID is required"),
  })
  .strict();

const formatIssues = (issues = []) =>
  issues.map((issue) => ({
    field: issue.path.join(".") || "form",
    message: issue.message,
  }));

const validatePublicId = (publicId) => {
  const result = z.string().uuid("Invalid lead ID").safeParse(publicId);

  if (!result.success) {
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
    data: result.data,
  };
};

export const validateCreateActivityPayload = ({
  params = {},
  query = {},
  body = {},
}) => {
  const publicIdResult = validatePublicId(params.publicId);

  if (!publicIdResult.success) {
    return publicIdResult;
  }

  const requestResult = baseRequestSchema.safeParse({
    companyId: body.companyId ?? query.companyId,
  });

  if (!requestResult.success) {
    return {
      success: false,
      errors: formatIssues(requestResult.error.issues),
    };
  }

  const activityResult = activitySchema.safeParse(normalizeActivityInput(body));

  if (!activityResult.success) {
    return {
      success: false,
      errors: formatIssues(activityResult.error.issues),
    };
  }

  return {
    success: true,
    data: {
      publicId: publicIdResult.data,
      companyId: requestResult.data.companyId,
      activity: activityResult.data,
    },
  };
};

export const validateListActivitiesQuery = ({ params = {}, query = {} }) => {
  const publicIdResult = validatePublicId(params.publicId);

  if (!publicIdResult.success) {
    return publicIdResult;
  }

  const requestResult = baseRequestSchema.safeParse({
    companyId: query.companyId,
  });

  if (!requestResult.success) {
    return {
      success: false,
      errors: formatIssues(requestResult.error.issues),
    };
  }

  return {
    success: true,
    data: {
      publicId: publicIdResult.data,
      companyId: requestResult.data.companyId,
    },
  };
};
