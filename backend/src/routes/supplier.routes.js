import express from "express";
import { createSupplier } from "../controllers/supplier.controller.js";

const router = express.Router();

router.post("/:companyId", createSupplier);

export default router;
