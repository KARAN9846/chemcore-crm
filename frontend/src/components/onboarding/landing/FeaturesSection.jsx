import FeatureItem from "./FeatureItem";

const FeaturesSection = () => {
  const features = [
    {
      icon: "bi bi-funnel",
      title: "Lead & Pipeline Management",
      desc: "Import leads, track conversations, manage follow-ups and move deals through the pipeline.",
    },
    {
      icon: "bi bi-file-earmark-text",
      title: "Quotation Builder",
      desc: "Create branded quotations with live margin calculator and PDF export.",
    },
    {
      icon: "bi bi-cart-check",
      title: "Order Management",
      desc: "Accept orders, set payment terms and manage packaging.",
    },
    {
      icon: "bi bi-building-gear",
      title: "Supplier & PO Tracking",
      desc: "Negotiate with suppliers and track production status.",
    },
    {
      icon: "bi bi-shield-check",
      title: "Compliance Documents",
      desc: "Track COA, MSDS and certificates automatically.",
    },
    {
      icon: "bi bi-graph-up-arrow",
      title: "Enterprise Reports",
      desc: "Revenue, margin, supplier performance and more.",
    },
    {
      icon: "bi bi-globe",
      title: "Multi-Currency Support",
      desc: "USD, EUR and INR support with conversion.",
    },
    {
      icon: "bi bi-people-fill",
      title: "Role-Based Access",
      desc: "Sales, Operations, Accounts and Admin roles.",
    },
    {
      icon: "bi bi-brush",
      title: "White-Label Ready",
      desc: "Custom domain, logo and branding.",
    },
  ];

  return (
    <div className="features-section">
      <div className="section-label">What's included</div>
      <div className="section-title">Everything a chemical exporter needs</div>
      <div className="section-sub">
        Built specifically for companies that source chemicals and export
        globally.
      </div>

      <div className="features-grid">
        {features.map((item, index) => (
          <FeatureItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
