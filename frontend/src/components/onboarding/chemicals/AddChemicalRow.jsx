const CATEGORY_OPTIONS = [
  "Industrial",
  "Specialty",
  "Commodity",
  "Pharma",
  "Inorganic",
  "Organic",
];
const UNIT_OPTIONS = [
  { value: "MT", label: "MT" },
  { value: "KG", label: "KG" },
  { value: "L", label: "Litre" },
  { value: "PCS", label: "PCS" },
];

const AddChemicalRow = ({
  chemical,
  nameError,
  updateNewChemical,
  addChemical,
}) => {
  return (
    <div className="add-chem-row">
      <div>
        <input
          type="text"
          className={`form-control ${nameError ? "is-invalid" : ""}`}
          placeholder="Chemical name"
          value={chemical.name}
          onChange={(event) => updateNewChemical("name", event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addChemical();
            }
          }}
          required
        />
        {nameError ? <div className="invalid-feedback">{nameError}</div> : null}
      </div>

      <input
        type="text"
        className="form-control"
        placeholder="Formula / Grade"
        value={chemical.formula}
        onChange={(event) => updateNewChemical("formula", event.target.value)}
      />

      <select
        className="form-select"
        value={chemical.category}
        onChange={(event) => updateNewChemical("category", event.target.value)}
      >
        <option value="">Category</option>
        {CATEGORY_OPTIONS.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <input
        type="text"
        className="form-control"
        placeholder="HS Code"
        maxLength={10}
        value={chemical.hsCode}
        onChange={(event) => updateNewChemical("hsCode", event.target.value)}
      />

      <select
        className="form-select"
        value={chemical.unit}
        onChange={(event) => updateNewChemical("unit", event.target.value)}
      >
        {UNIT_OPTIONS.map((unit) => (
          <option key={unit.value} value={unit.value}>
            {unit.label}
          </option>
        ))}
      </select>

      <button type="button" className="btn-add-chem-row" onClick={addChemical}>
        <i className="bi bi-plus-lg"></i> Add
      </button>
    </div>
  );
};

export default AddChemicalRow;
