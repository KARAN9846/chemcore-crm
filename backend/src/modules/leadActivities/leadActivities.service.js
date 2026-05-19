import db from "../../config/db.js";
import {
  mapActivityResponse,
  mapCreateActivityToDb,
} from "./leadActivities.mapper.js";

const findLeadSql = `
  SELECT id, public_id, company_id, initial_stage, current_stage, status
  FROM leads
  WHERE company_id = $1
    AND public_id = $2
  LIMIT 1
`;

const activitySelectSql = `
  SELECT
    la.*,
    l.public_id AS lead_public_id
  FROM lead_activities la
  INNER JOIN leads l ON l.id = la.lead_id
`;

export const createLeadActivity = async ({ companyId, publicId, activity }) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const leadResult = await client.query(findLeadSql, [companyId, publicId]);
    const lead = leadResult.rows[0];

    if (!lead) {
      await client.query("ROLLBACK");
      return null;
    }

    const dbPayload = mapCreateActivityToDb({ companyId, lead, activity });

    const insertResult = await client.query(
      `INSERT INTO lead_activities (
        company_id,
        lead_id,
        activity_type,
        subject,
        notes,
        outcome,
        previous_stage,
        new_stage,
        followup_date,
        followup_time,
        followup_via,
        activity_date,
        activity_time,
        created_by
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,NULLIF($10, '')::time,
        $11,$12,NULLIF($13, '')::time,$14
      )
      RETURNING *`,
      [
        dbPayload.company_id,
        dbPayload.lead_id,
        dbPayload.activity_type,
        dbPayload.subject,
        dbPayload.notes,
        dbPayload.outcome,
        dbPayload.previous_stage,
        dbPayload.new_stage,
        dbPayload.followup_date,
        dbPayload.followup_time,
        dbPayload.followup_via,
        dbPayload.activity_date,
        dbPayload.activity_time,
        dbPayload.created_by,
      ],
    );

    if (activity.newStage || activity.followUp?.date) {
      await client.query(
        `UPDATE leads
         SET current_stage = COALESCE($1, current_stage),
             followup_date = COALESCE($2, followup_date),
             followup_time = COALESCE(NULLIF($3, '')::time, followup_time),
             followup_via = COALESCE($4, followup_via),
             updated_at = NOW()
         WHERE id = $5
           AND company_id = $6`,
        [
          activity.newStage,
          activity.followUp?.date ?? null,
          activity.followUp?.time ?? null,
          activity.followUp?.via ?? null,
          lead.id,
          companyId,
        ],
      );
    }

    const activityResult = await client.query(
      `${activitySelectSql}
       WHERE la.id = $1
       LIMIT 1`,
      [insertResult.rows[0].id],
    );

    await client.query("COMMIT");

    return mapActivityResponse(activityResult.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const listLeadActivities = async ({ companyId, publicId }) => {
  const leadResult = await db.query(findLeadSql, [companyId, publicId]);
  const lead = leadResult.rows[0];

  if (!lead) {
    return null;
  }

  const result = await db.query(
    `${activitySelectSql}
     WHERE la.company_id = $1
       AND la.lead_id = $2
     ORDER BY la.activity_date DESC NULLS LAST,
       la.activity_time DESC NULLS LAST,
       la.created_at DESC,
       la.id DESC`,
    [companyId, lead.id],
  );

  return result.rows.map(mapActivityResponse);
};
