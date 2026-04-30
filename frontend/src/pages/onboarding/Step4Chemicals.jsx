import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/layout/TopBar";
import ProgressBar from "../../components/onboarding/layout/ProgressBar";
import AddChemicalRow from "../../components/onboarding/chemicals/AddChemicalRow";
import ChemicalSuggestions from "../../components/onboarding/chemicals/ChemicalSuggestions";
import ChemicalTable from "../../components/onboarding/chemicals/ChemicalTable";
import { saveChemicals } from "../../api/chemical.api";
import { useOnboarding } from "../../context/useOnboarding";
import { showError, showLoading, updateToast } from "../../utils/toast";

const CHEMICAL_SUGGESTIONS = [
  {
    name: "Caustic Soda",
    formula: "NaOH",
    category: "Inorganic",
    unit: "MT",
    icon: "\u{1F9EA}",
  },
  {
    name: "Soda Ash",
    formula: "Na\u2082CO\u2083",
    category: "Inorganic",
    unit: "MT",
    icon: "\u2697\uFE0F",
  },
  {
    name: "Sulfuric Acid",
    formula: "H\u2082SO\u2084",
    category: "Industrial",
    unit: "MT",
    icon: "\u{1F52C}",
  },
  {
    name: "Hydrochloric Acid",
    formula: "HCl",
    category: "Industrial",
    unit: "MT",
    icon: "\u2697\uFE0F",
  },
  {
    name: "Sodium Hypochlorite",
    formula: "NaOCl",
    category: "Specialty",
    unit: "MT",
    icon: "\u{1F4A7}",
  },
  {
    name: "Ammonium Nitrate",
    formula: "NH\u2084NO\u2083",
    category: "Industrial",
    unit: "MT",
    icon: "\u{1F331}",
  },
  {
    name: "Nitrocellulose",
    formula: "NC",
    category: "Specialty",
    unit: "KG",
    icon: "\u{1F9E8}",
  },
  {
    name: "Alkyd Resin",
    formula: "\u2014",
    category: "Specialty",
    unit: "MT",
    icon: "\u{1FAA3}",
  },
  {
    name: "Titanium Dioxide",
    formula: "TiO\u2082",
    category: "Industrial",
    unit: "MT",
    icon: "\u2B1C",
  },
  {
    name: "Sodium Silicate",
    formula: "Na\u2082SiO\u2083",
    category: "Commodity",
    unit: "MT",
    icon: "\u{1FAD9}",
  },
];

const createChemical = ({
  name,
  formula = "",
  category = "",
  hsCode = "",
  unit = "MT",
  icon = "\u2697\uFE0F",
}) => ({
  id: crypto.randomUUID(),
  name,
  formula,
  category,
  hsCode,
  unit,
  icon,
});

const createEmptyChemical = () => ({
  name: "",
  formula: "",
  category: "",
  hsCode: "",
  unit: "MT",
});

const Step4Chemicals = () => {
  const navigate = useNavigate();
  const { companyId, setOnboardingChemicals } = useOnboarding();
  const [chemicals, setChemicals] = useState([]);
  const [newChemical, setNewChemical] = useState(createEmptyChemical);
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);

  const addChemical = (chemical) => {
    const exists = chemicals.some(
      (existingChemical) =>
        existingChemical.name.toLowerCase() === chemical.name.toLowerCase(),
    );

    if (exists) {
      return false;
    }

    setChemicals((prev) => [...prev, chemical]);
    return true;
  };

  const addSuggestion = (suggestion) => {
    addChemical(createChemical(suggestion));
  };

  const updateChemical = (id, field, value) => {
    setChemicals((prev) =>
      prev.map((chemical) =>
        chemical.id === id ? { ...chemical, [field]: value } : chemical,
      ),
    );
  };

  const removeChemical = (id) => {
    setChemicals((prev) => prev.filter((chemical) => chemical.id !== id));
  };

  const updateNewChemical = (field, value) => {
    if (field === "name") {
      setNameError("");
    }

    setNewChemical((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addManualChemical = () => {
    const chemicalName = newChemical.name.trim();

    if (!chemicalName) {
      setNameError("Name required.");
      return;
    }

    const wasAdded = addChemical(
      createChemical({
        ...newChemical,
        name: chemicalName,
      }),
    );

    if (!wasAdded) {
      setNameError("This chemical already exists.");
      return;
    }

    setNewChemical(createEmptyChemical());
    setNameError("");
  };

  const handleContinue = async () => {
    if (chemicals.length === 0) {
      showError("Please add at least one chemical before continuing.");
      return;
    }

    if (!companyId) {
      showError("Company ID missing");
      return;
    }

    const payload = chemicals.map((chemical) => ({
      name: chemical.name,
      formula: chemical.formula,
      category: chemical.category,
      hsCode: chemical.hsCode,
      unit: chemical.unit,
    }));
    const toastId = showLoading("Saving chemicals...");

    try {
      setLoading(true);

      const res = await saveChemicals(companyId, payload);

      if (res.success) {
        setOnboardingChemicals(chemicals);
        updateToast(toastId, "Chemicals saved successfully", "success");
        navigate("/onboarding/step5");
        return;
      }

      updateToast(toastId, res.message || "Failed to save", "error");
    } catch (err) {
      console.error("Chemical save error:", err);
      updateToast(toastId, "Server error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step4">
      <TopBar variant="secure" />
      <ProgressBar currentStep={4} />

      <div className="main-wrap">
        <div className="form-container">
          <div className="step-header">
            <div className="step-badge">
              <i className="bi bi-droplet"></i> Step 4 of 6
            </div>

            <h2 className="step-title">
              Chemical Master List
              <span className="chem-count-badge">{chemicals.length}</span>
            </h2>

            <p className="step-sub">
              Add the chemicals your company exports. These will appear in lead
              forms, quotations, orders and reports. Add grades/specifications
              per chemical. You can add more later.
            </p>
          </div>

          <ChemicalSuggestions
            suggestions={CHEMICAL_SUGGESTIONS}
            chemicals={chemicals}
            addSuggestion={addSuggestion}
          />

          <ChemicalTable
            chemicals={chemicals}
            updateChemical={updateChemical}
            removeChemical={removeChemical}
          >
            <AddChemicalRow
              chemical={newChemical}
              nameError={nameError}
              updateNewChemical={updateNewChemical}
              addChemical={addManualChemical}
            />
          </ChemicalTable>

          <div className="hs-note">
            <i className="bi bi-info-circle"></i>
            HS codes are used on export documents. You can look them up at{" "}
            <a href="https://www.hscode.in" target="_blank" rel="noreferrer">
              hscode.in
            </a>{" "}
            or add them later.
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate("/onboarding/step3")}
            >
              <i className="bi bi-arrow-left"></i> Back
            </button>

            <span className="skip-link">
              <a
                href="/onboarding/step5"
                onClick={(event) => {
                  event.preventDefault();
                  setOnboardingChemicals(chemicals);
                  navigate("/onboarding/step5");
                }}
              >
                Skip for now →
              </a>
            </span>

            <button
              type="button"
              className="btn-next"
              onClick={handleContinue}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save & Continue"}{" "}
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Chemicals;
