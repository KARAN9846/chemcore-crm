import crypto from "crypto";
import db from "../config/db.js";
import { updateOnboardingStep } from "../utils/updateOnboardingStep.js";
import { teamInviteSchema } from "../../../shared/validation/team.schema.js";

export const getTeamMembers = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId || Number.isNaN(Number(companyId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const result = await db.query(
      `SELECT id, name, email, role, status
       FROM users
       WHERE company_id = $1
       ORDER BY id ASC`,
      [companyId],
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Team Fetch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const inviteTeam = async (req, res) => {
  const client = await db.connect();

  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID missing",
      });
    }

    const parsed = teamInviteSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.errors,
      });
    }

    const { members } = parsed.data;

    if (!members || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No members provided",
      });
    }

    const insertedUsers = [];

    await client.query("BEGIN");

    for (const member of members) {
      const existing = await client.query(
        "SELECT id FROM users WHERE email=$1 AND company_id=$2",
        [member.email, companyId],
      );

      if (existing.rows.length > 0) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: `Email already invited: ${member.email}`,
        });
      }

      const token = crypto.randomBytes(32).toString("hex");

      const result = await client.query(
        `INSERT INTO users (company_id, name, email, role, invite_token)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, role, status`,
        [companyId, member.name, member.email, member.role, token],
      );

      insertedUsers.push(result.rows[0]);
    }

    await client.query("COMMIT");
    await updateOnboardingStep(companyId, 4);

    return res.status(200).json({
      success: true,
      message: "Invites processed",
      users: insertedUsers,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Invite Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  } finally {
    client.release();
  }
};
