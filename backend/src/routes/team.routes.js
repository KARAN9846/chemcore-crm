import express from "express";
import {
  getTeamMembers,
  inviteTeam,
} from "../controllers/team.controller.js";

const router = express.Router();

router.get("/:companyId", getTeamMembers);
router.post("/invite/:companyId", inviteTeam);

export default router;
