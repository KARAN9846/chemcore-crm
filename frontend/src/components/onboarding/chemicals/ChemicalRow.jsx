const CATEGORY_OPTIONS = [
  "Industrial",
  "Specialty",
  "Commodity",
  "Pharma",
  "Inorganic",
  "Organic",
];
const UNIT_OPTIONS = ["MT", "KG", "L", "PCS"];

const getCategoryClass = (category) => {
  const normalizedCategory = (category || "").toLowerCase();

  if (normalizedCategory === "commodity" || normalizedCategory === "inorganic") {
    return "cat-commodity";
  }

  if (normalizedCategory === "pharma") {
    return "cat-pharma";
  }

  if (normalizedCategory === "specialty" || normalizedCategory === "organic") {
    return "cat-specialty";
  }

  return "cat-industrial";
};

const ChemicalRow = ({ chemical, updateChemical, removeChemical }) => {
  const categoryLabel = chemical.category;

  return (
    <div className="chem-row">
      <div className="chem-name-cell">
        <div className="chem-icon">{chemical.icon}</div>

        <div>
          <div className="chem-name-text">{chemical.name}</div>
          {categoryLabel ? (
            <span className={`cat-badge ${getCategoryClass(chemical.category)}`}>
              {categoryLabel}
            </span>
          ) : null}
        </div>
      </div>

      <input
        type="text"
        className="form-control"
        placeholder="Formula / Grade"
        value={chemical.formula}
        onChange={(event) =>
          updateChemical(chemical.id, "formula", event.target.value)
        }
      />

      <select
        className="form-select"
        value={chemical.category}
        onChange={(event) =>
          updateChemical(chemical.id, "category", event.target.value)
        }
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
        onChange={(event) =>
          updateChemical(chemical.id, "hsCode", event.target.value)
        }
      />

      <select
        className="form-select"
        value={chemical.unit}
        onChange={(event) =>
          updateChemical(chemical.id, "unit", event.target.value)
        }
      >
        {UNIT_OPTIONS.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="btn-del-chem"
        onClick={() => removeChemical(chemical.id)}
        aria-label={`Delete ${chemical.name}`}
      >
        <i className="bi bi-x-lg"></i>
      </button>
    </div>
  );
};

export default ChemicalRow;
