import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

// ✅ Debug (remove later)
console.log("DB ENV CHECK:", {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: String(process.env.DB_PASSWORD || "postgres123"), // 🔥 FIX
  database: process.env.DB_NAME || "chemcore_crm",
  port: process.env.DB_PORT || 5432,
});

export default pool;
