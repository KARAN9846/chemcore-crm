import express from "express";
import { inviteTeam } from "../controllers/team.controller.js";

const router = express.Router();

router.post("/invite/:companyId", inviteTeam);

export default router;
