import express from "express";
import {
  createSupplier,
  getSupplier,
} from "../controllers/supplier.controller.js";

const router = express.Router();

router.get("/:companyId", getSupplier);
router.post("/:companyId", createSupplier);

export default router;
