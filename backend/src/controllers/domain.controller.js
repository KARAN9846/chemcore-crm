import pool from "../config/db.js";

const DOMAIN_NAME_REGEX = /^(?!-)[a-z0-9-]+(?<!-)$/;
const RESERVED = ["admin", "app", "test", "api", "www"];

export const checkDomainAvailability = async (req, res) => {
  try {
    const { name } = req.query;
    const normalizedName =
      typeof name === "string" ? name.trim().toLowerCase() : "";

    if (!normalizedName || !DOMAIN_NAME_REGEX.test(normalizedName)) {
      return res.status(400).json({
        available: false,
        message: "Invalid domain name",
      });
    }

    if (RESERVED.includes(normalizedName)) {
      return res.json({ available: false });
    }

    const result = await pool.query(
      "SELECT id FROM branding WHERE subdomain = $1 LIMIT 1",
      [normalizedName],
    );

    if (result.rowCount > 0) {
      return res.json({
        available: false,
      });
    }

    return res.json({
      available: true,
    });
  } catch (error) {
    console.error("FULL ERROR:", error);
    return res.status(500).json({
      available: false,
      message: "Internal server error",
    });
  }
};
