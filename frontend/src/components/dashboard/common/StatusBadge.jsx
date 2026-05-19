const StatusBadge = ({ label, variant = "neutral" }) => {
  return <span className={`dashboard-status-badge ${variant}`}>{label}</span>;
};

export default StatusBadge;
