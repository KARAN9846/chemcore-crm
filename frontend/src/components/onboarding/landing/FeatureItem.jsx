const FeatureItem = ({ icon, title, desc }) => {
  return (
    <div className="feature-item">
      <div className="feature-icon">
        <i className={icon}></i>
      </div>

      <div className="feature-text">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
};

export default FeatureItem;
