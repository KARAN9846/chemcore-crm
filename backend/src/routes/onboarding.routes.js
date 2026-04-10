import express from "express";
import {
  createCompany,
  getBrandingByCompanyId,
  getCompanyById,
  saveBranding,
  updateCompany,
} from "../controllers/onboarding.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/company", upload.single("logo"), createCompany);
router.put("/company/:id", upload.single("logo"), updateCompany);
router.get("/company/:id", getCompanyById);
router.put("/branding/:companyId", saveBranding);
router.get("/branding/:companyId", getBrandingByCompanyId);

export default router;
