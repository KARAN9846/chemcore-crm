import express from "express";
import cors from "cors";
import onboardingRoutes from "./routes/onboarding.routes.js";
import companyRoutes from "./routes/company.routes.js";
import devRoutes from "./routes/dev.routes.js";
import brandingRoutes from "./routes/branding.routes.js";
import domainRoutes from "./routes/domain.routes.js";
import teamRoutes from "./routes/team.routes.js";
import chemicalRoutes from "./routes/chemical.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import leadRoutes from "./modules/leads/leads.routes.js";
import quotationRoutes from "./modules/quotations/quotations.routes.js";

const app = express(); // FIRST create app
const allowedOrigins = [
  "http://localhost:5173",
  "https://chemcore-crm.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// middlewares
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

// serve uploads
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/dev", devRoutes);
app.use("/api/branding", brandingRoutes);
app.use("/api/domain", domainRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/chemicals", chemicalRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/quotations", quotationRoutes);

// health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
