import pool from "../config/db.js";
import {
  companySchema,
} from "../../../shared/validation/company.schema.js";
import {
  brandingSchema,
  normalizeBrandingInput,
} from "../../../shared/validation/branding.schema.js";

const clean = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizeRequestBody = (body = {}) =>
  Object.fromEntries(
    Object.entries(body).map(([key, value]) => [key, clean(value)]),
  );

const validateCompanyPayload = (body) => {
  const result = companySchema.safeParse(sanitizeRequestBody(body));

  if (result.success) {
    return { errors: [], data: result.data };
  }

  return {
    errors: result.error.issues.map((issue) => ({
      field: issue.path[0] || "form",
      message: issue.message,
    })),
    data: null,
  };
};

const validateBrandingPayload = (body) => {
  const normalizedPayload = normalizeBrandingInput(sanitizeRequestBody(body));
  const result = brandingSchema.safeParse(normalizedPayload);

  if (result.success) {
    return { errors: [], data: result.data };
  }

  return {
    errors: result.error.issues.map((issue) => ({
      field: issue.path[0] || "form",
      message: issue.message,
    })),
    data: null,
  };
};

const mapCompanyPayload = (payload) => ({
  company_name: payload.companyName,
  company_type: payload.companyType,
  description: payload.description,
  gst_number: payload.gstNumber,
  iec_code: payload.iecCode,
  pan_number: payload.panNumber,
  year_established: payload.yearEstablished,
  address: payload.addressLine1,
  address2: payload.addressLine2,
  city: payload.city,
  state: payload.state,
  pincode: payload.pinCode,
  country: payload.country,
  currency: payload.baseCurrency,
  contact_email: payload.companyEmail,
  contact_phone: payload.companyPhone,
  website: payload.website,
  timezone: payload.timezone,
});

const mapBrandingPayload = (payload) => ({
  primary_color: payload.primaryColor,
  workspace_name: payload.workspaceName,
  tagline: payload.tagline,
  from_name: payload.fromName,
  reply_to: payload.replyTo,
  subdomain: payload.subdomain,
  custom_domain: payload.customDomain,
});

const ensureBrandingTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS company_branding (
      id SERIAL PRIMARY KEY,
      company_id INTEGER NOT NULL UNIQUE REFERENCES companies(id) ON DELETE CASCADE,
      primary_color VARCHAR(7) NOT NULL,
      workspace_name VARCHAR(50) NOT NULL,
      tagline VARCHAR(60),
      from_name VARCHAR(50) NOT NULL,
      reply_to VARCHAR(255) NOT NULL,
      subdomain VARCHAR(63),
      custom_domain VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

export const createCompany = async (req, res) => {
  try {
    const { errors: validationError, data: validatedPayload } =
      validateCompanyPayload(req.body);

    if (validationError.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationError,
      });
    }

    const dbPayload = mapCompanyPayload(validatedPayload);
    const logo = req.file ? req.file.filename : null;

    const result = await pool.query(
      `INSERT INTO companies (
        company_name,
        company_type,
        description,
        gst_number,
        iec_code,
        pan_number,
        year_established,
        address,
        address2,
        city,
        state,
        pincode,
        country,
        currency,
        contact_email,
        contact_phone,
        website,
        timezone,
        logo_url
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19
      )
      RETURNING *`,
      [
        dbPayload.company_name,
        dbPayload.company_type,
        dbPayload.description,
        dbPayload.gst_number,
        dbPayload.iec_code,
        dbPayload.pan_number,
        dbPayload.year_established,
        dbPayload.address,
        dbPayload.address2,
        dbPayload.city,
        dbPayload.state,
        dbPayload.pincode,
        dbPayload.country,
        dbPayload.currency,
        dbPayload.contact_email,
        dbPayload.contact_phone,
        dbPayload.website,
        dbPayload.timezone,
        logo,
      ],
    );

    const savedCompany = result.rows[0];

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: {
        companyId: savedCompany.id,
      },
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { errors: validationError, data: validatedPayload } =
      validateCompanyPayload(req.body);

    if (validationError.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationError,
      });
    }

    const dbPayload = mapCompanyPayload(validatedPayload);
    const logo = req.file ? req.file.filename : null;

    const result = await pool.query(
      `UPDATE companies
      SET
        company_name = $1,
        company_type = $2,
        description = $3,
        gst_number = $4,
        iec_code = $5,
        pan_number = $6,
        year_established = $7,
        address = $8,
        address2 = $9,
        city = $10,
        state = $11,
        pincode = $12,
        country = $13,
        currency = $14,
        contact_email = $15,
        contact_phone = $16,
        website = $17,
        timezone = $18,
        logo_url = COALESCE($19, logo_url)
      WHERE id = $20
      RETURNING *`,
      [
        dbPayload.company_name,
        dbPayload.company_type,
        dbPayload.description,
        dbPayload.gst_number,
        dbPayload.iec_code,
        dbPayload.pan_number,
        dbPayload.year_established,
        dbPayload.address,
        dbPayload.address2,
        dbPayload.city,
        dbPayload.state,
        dbPayload.pincode,
        dbPayload.country,
        dbPayload.currency,
        dbPayload.contact_email,
        dbPayload.contact_phone,
        dbPayload.website,
        dbPayload.timezone,
        logo,
        id,
      ],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    const savedCompany = result.rows[0];

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: {
        companyId: savedCompany.id,
      },
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM companies WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.status(200).json({
      message: "Company fetched successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const saveBranding = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { errors: validationError, data: validatedPayload } =
      validateBrandingPayload(req.body);

    if (validationError.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationError,
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

    await ensureBrandingTable();

    const dbPayload = mapBrandingPayload(validatedPayload);
    const result = await pool.query(
      `INSERT INTO company_branding (
        company_id,
        primary_color,
        workspace_name,
        tagline,
        from_name,
        reply_to,
        subdomain,
        custom_domain
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (company_id)
      DO UPDATE SET
        primary_color = EXCLUDED.primary_color,
        workspace_name = EXCLUDED.workspace_name,
        tagline = EXCLUDED.tagline,
        from_name = EXCLUDED.from_name,
        reply_to = EXCLUDED.reply_to,
        subdomain = EXCLUDED.subdomain,
        custom_domain = EXCLUDED.custom_domain,
        updated_at = NOW()
      RETURNING *`,
      [
        companyId,
        dbPayload.primary_color,
        dbPayload.workspace_name,
        dbPayload.tagline,
        dbPayload.from_name,
        dbPayload.reply_to,
        dbPayload.subdomain,
        dbPayload.custom_domain,
      ],
    );

    return res.status(200).json({
      success: true,
      message: "Branding saved successfully",
      data: {
        companyId: Number(companyId),
        branding: result.rows[0],
      },
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getBrandingByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;

    await ensureBrandingTable();

    const result = await pool.query(
      "SELECT * FROM company_branding WHERE company_id = $1",
      [companyId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Branding not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
