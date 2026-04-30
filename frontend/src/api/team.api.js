export const inviteTeam = async (companyId, members) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/team/invite/${companyId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ members }),
    },
  );

  return res.json();
};
