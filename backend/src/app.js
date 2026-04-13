import express from "express";
import cors from "cors";
import onboardingRoutes from "./routes/onboarding.routes.js";
import brandingRoutes from "./routes/branding.routes.js";
import domainRoutes from "./routes/domain.routes.js";

const app = express(); // FIRST create app

// middlewares
app.use(cors());
app.use(express.json());

// serve uploads
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/branding", brandingRoutes);
app.use("/api/domain", domainRoutes);

// health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
