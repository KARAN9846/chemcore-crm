import pool from "../config/db.js";
import { updateOnboardingStep } from "../utils/updateOnboardingStep.js";
import {
  brandingSchema,
  normalizeBrandingInput,
} from "../../../shared/validation/branding.schema.js";

const clean = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizeRequestBody = (body = {}) =>
  Object.fromEntries(
    Object.entries(body).map(([key, value]) => [key, clean(value)]),
  );

const REQUIRED_FIELDS = [
  "primaryColor",
  "workspaceName",
  "fromName",
  "replyTo",
];

const ensureBrandingTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS branding (
      id SERIAL PRIMARY KEY,
      company_id INTEGER NOT NULL UNIQUE REFERENCES companies(id) ON DELETE CASCADE,
      primary_color VARCHAR(255) NOT NULL,
      workspace_name VARCHAR(255) NOT NULL,
      tagline TEXT,
      subdomain VARCHAR(255),
      custom_domain VARCHAR(255),
      from_name VARCHAR(255) NOT NULL,
      reply_to_email VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

const validateBrandingPayload = (body) => {
  const sanitizedBody = sanitizeRequestBody(body);
  const normalizedPayload = normalizeBrandingInput(sanitizedBody);
  const missingRequiredFields = REQUIRED_FIELDS.some(
    (field) => !normalizedPayload[field],
  );

  if (missingRequiredFields) {
    return {
      missingRequiredFields: true,
      errors: [],
      data: null,
    };
  }

  const result = brandingSchema.safeParse(normalizedPayload);

  if (result.success) {
    return {
      missingRequiredFields: false,
      errors: [],
      data: result.data,
    };
  }

  return {
    missingRequiredFields: false,
    errors: result.error.issues.map((issue) => ({
      field: issue.path[0] || "form",
      message: issue.message,
    })),
    data: null,
  };
};

const mapBrandingPayload = (payload) => ({
  primary_color: payload.primaryColor,
  workspace_name: payload.workspaceName,
  tagline: payload.tagline,
  subdomain: payload.subdomain,
  custom_domain: payload.customDomain,
  from_name: payload.fromName,
  reply_to_email: payload.replyTo,
});

export const saveBranding = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId || Number.isNaN(Number(companyId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const {
      missingRequiredFields,
      errors: validationErrors,
      data: validatedPayload,
    } = validateBrandingPayload(req.body);

    if (missingRequiredFields) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }

    const companyCheck = await pool.query(
      "SELECT id FROM companies WHERE id = $1",
      [companyId],
    );

    if (companyCheck.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const dbPayload = mapBrandingPayload(validatedPayload);
    const existingBranding = await pool.query(
      "SELECT id FROM branding WHERE company_id = $1",
      [companyId],
    );

    let result;

    if (existingBranding.rowCount > 0) {
      result = await pool.query(
        `UPDATE branding
        SET
          primary_color = $1,
          workspace_name = $2,
          tagline = $3,
          subdomain = $4,
          custom_domain = $5,
          from_name = $6,
          reply_to_email = $7,
          updated_at = NOW()
        WHERE company_id = $8
        RETURNING *`,
        [
          dbPayload.primary_color,
          dbPayload.workspace_name,
          dbPayload.tagline,
          dbPayload.subdomain,
          dbPayload.custom_domain,
          dbPayload.from_name,
          dbPayload.reply_to_email,
          companyId,
        ],
      );
    } else {
      result = await pool.query(
        `INSERT INTO branding (
          company_id,
          primary_color,
          workspace_name,
          tagline,
          subdomain,
          custom_domain,
          from_name,
          reply_to_email
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          companyId,
          dbPayload.primary_color,
          dbPayload.workspace_name,
          dbPayload.tagline,
          dbPayload.subdomain,
          dbPayload.custom_domain,
          dbPayload.from_name,
          dbPayload.reply_to_email,
        ],
      );
    }

    console.log("BRANDING SAVE COMPLETE");
    console.log("UPDATING STEP TO:", 3);
    console.log("COMPANY ID:", companyId);
    await updateOnboardingStep(companyId, 3);

    return res.status(200).json({
      success: true,
      message: "Branding saved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("FULL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getBranding = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId || Number.isNaN(Number(companyId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const result = await pool.query(
      "SELECT * FROM branding WHERE company_id = $1",
      [companyId],
    );

    if (result.rowCount === 0) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("FULL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
