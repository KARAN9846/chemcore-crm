const StepCard = ({ number, icon, title, desc, time }) => {
  return (
    <div className="step-card">
      <div className="step-num">{number}</div>

      <div className="step-icon">
        <i className={icon}></i>
      </div>

      <div className="step-title">{title}</div>
      <div className="step-desc">{desc}</div>

      <span className="step-time">{time}</span>
    </div>
  );
};

export default StepCard;
