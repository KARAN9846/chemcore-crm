import express from "express";
import {
  getChemicals,
  saveChemicals,
} from "../controllers/chemical.controller.js";

const router = express.Router();

router.get("/:companyId", getChemicals);
router.post("/:companyId", saveChemicals);
router.post("/save/:companyId", saveChemicals);

export default router;
