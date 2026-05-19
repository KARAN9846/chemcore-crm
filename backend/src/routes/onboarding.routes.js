import express from "express";
import {
  createCompany,
  getCompanyById,
  getOnboardingStatus,
  getOnboardingSummary,
  markOnboardingComplete,
  saveOnboardingStep,
  updateCompany,
} from "../controllers/onboarding.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/company", upload.single("logo"), createCompany);
router.put("/company/:id", upload.single("logo"), updateCompany);
router.get("/company/:id", getCompanyById);
router.get("/status/:companyId", getOnboardingStatus);
router.patch("/step/:companyId", saveOnboardingStep);
router.post("/complete/:companyId", markOnboardingComplete);
router.get("/summary/:companyId", getOnboardingSummary);

export default router;
