import express from "express";
import { getCompany } from "../controllers/company.controller.js";

const router = express.Router();

router.get("/:companyId", getCompany);

export default router;
