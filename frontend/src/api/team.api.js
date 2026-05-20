import { buildApiUrl } from "../config/api";

export const inviteTeam = async (companyId, members) => {
  const res = await fetch(
    buildApiUrl(`/team/invite/${companyId}`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ members }),
      credentials: "include",
    },
  );

  return res.json();
};
