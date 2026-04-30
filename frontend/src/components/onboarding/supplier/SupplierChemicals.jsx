const getChemicalName = (chemical) =>
  typeof chemical === "string" ? chemical : chemical.name;

const SupplierChemicals = ({ availableChemicals, selectedChemicals, onToggle }) => {
  const chemicals = availableChemicals
    .map(getChemicalName)
    .filter(Boolean);

  return (
    <div className="form-section">
      <div className="section-heading">
        <i className="bi bi-droplet"></i> Chemicals Supplied
      </div>

      <label className="form-label">Select chemicals this supplier provides:</label>

      <div className="chem-multi">
        {chemicals.map((chemical) => (
          <button
            key={chemical}
            type="button"
            className={`chem-toggle ${
              selectedChemicals.includes(chemical) ? "selected" : ""
            }`}
            onClick={() => onToggle(chemical)}
          >
            {chemical}
          </button>
        ))}
      </div>

      {chemicals.length === 0 && (
        <div className="form-hint mt-2">
          Add chemicals in Step 4 first, then select which ones this supplier
          provides.
        </div>
      )}

      {chemicals.length > 0 && (
        <div className="form-hint mt-2">
          You can add more chemicals and pricing details later from the Supplier
          profile page.
        </div>
      )}
    </div>
  );
};

export default SupplierChemicals;
