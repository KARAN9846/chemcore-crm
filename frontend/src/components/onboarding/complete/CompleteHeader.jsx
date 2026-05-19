const CompleteHeader = ({ company, teamCount, chemicalsCount }) => {
  void company;
  void teamCount;
  void chemicalsCount;

  return (
    <>
      <div className="success-anim" aria-hidden="true">
        <div className="success-circle">🎉</div>
        <div className="confetti-dot cd1"></div>
        <div className="confetti-dot cd2"></div>
        <div className="confetti-dot cd3"></div>
        <div className="confetti-dot cd4"></div>
        <div className="confetti-dot cd5"></div>
        <div className="confetti-dot cd6"></div>
      </div>

      <h2 className="complete-title">Your workspace is ready!</h2>
      <p className="complete-sub">
        ChemCore CRM has been set up successfully. Your team invitations have
        been sent and your chemical master list is ready. Start adding leads and
        close your first export deal.
      </p>
    </>
  );
};

export default CompleteHeader;
