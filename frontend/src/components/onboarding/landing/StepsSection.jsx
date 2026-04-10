import StepCard from "./StepCard";

const StepsSection = () => {
  const steps = [
    {
      number: 1,
      icon: "bi bi-building",
      title: "Company Profile",
      desc: "Name, logo, address, country and base currency for your workspace.",
      time: "~1 min",
    },
    {
      number: 2,
      icon: "bi bi-palette",
      title: "Branding",
      desc: "Set your brand color, email header and custom domain.",
      time: "~1 min",
    },
    {
      number: 3,
      icon: "bi bi-people",
      title: "Invite Team",
      desc: "Add your Sales, Operations and Accounts team members.",
      time: "~1 min",
    },
    {
      number: 4,
      icon: "bi bi-droplet",
      title: "Chemicals List",
      desc: "Add chemicals and grades your company exports.",
      time: "~1 min",
    },
    {
      number: 5,
      icon: "bi bi-truck",
      title: "First Supplier",
      desc: "Add your first supplier (optional).",
      time: "~1 min",
    },
    {
      number: 6,
      icon: "bi bi-check-circle",
      title: "All Done!",
      desc: "Your workspace is ready. Start adding leads.",
      time: "Launch!",
    },
  ];

  return (
    <div className="steps-section">
      <div className="section-label">What to expect</div>
      <div className="section-title">6 simple steps to get started</div>
      <div className="section-sub">
        Each step is quick. You can always edit everything later.
      </div>

      <div className="steps-grid">
        {steps.map((step) => (
          <StepCard key={step.number} {...step} />
        ))}
      </div>
    </div>
  );
};

export default StepsSection;
