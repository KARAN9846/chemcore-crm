import express from "express";
import {
  createCompany,
  getCompanyById,
  updateCompany,
} from "../controllers/onboarding.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/company", upload.single("logo"), createCompany);
router.put("/company/:id", upload.single("logo"), updateCompany);
router.get("/company/:id", getCompanyById);

export default router;
