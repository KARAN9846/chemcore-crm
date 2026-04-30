import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/layout/TopBar";
import ProgressBar from "../../components/onboarding/layout/ProgressBar";
import PrimaryContact from "../../components/onboarding/supplier/PrimaryContact";
import SupplierChemicals from "../../components/onboarding/supplier/SupplierChemicals";
import SupplierCompany from "../../components/onboarding/supplier/SupplierCompany";
import SupplierRating from "../../components/onboarding/supplier/SupplierRating";
import SupplyTerms from "../../components/onboarding/supplier/SupplyTerms";
import { createSupplier } from "../../api/supplier.api";
import { useOnboarding } from "../../context/useOnboarding";
import { clearOnboardingStorage } from "../../utils/onboardingStorage";
import { showError, showLoading, updateToast } from "../../utils/toast";

const initialSupplier = {
  companyName: "",
  supplierType: "manufacturer",
  city: "",
  country: "IN",

  contactPerson: "",
  designation: "",
  email: "",
  phone: "",

  chemicals: [],

  minOrder: "",
  leadTime: "",
  reliability: "High",
  paymentTerms: [],

  rating: 0,
  notes: "",
};

const toggleItem = (items, item) =>
  items.includes(item)
    ? items.filter((currentItem) => currentItem !== item)
    : [...items, item];

const Step5Supplier = () => {
  const navigate = useNavigate();
  const { companyId, onboardingChemicals } = useOnboarding();
  const [supplier, setSupplier] = useState(initialSupplier);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const nextErrors = {};

    if (!supplier.companyName.trim()) {
      nextErrors.companyName = "Company name is required";
    }

    if (!supplier.contactPerson.trim()) {
      nextErrors.contactPerson = "Contact person is required";
    }

    if (!supplier.email.includes("@")) {
      nextErrors.email = "Invalid email";
    }

    if (!supplier.minOrder || Number(supplier.minOrder) <= 0) {
      nextErrors.minOrder = "Enter valid minimum order";
    }

    if (!supplier.leadTime) {
      nextErrors.leadTime = "Lead time required";
    }

    if (!supplier.paymentTerms.length) {
      nextErrors.paymentTerms = "Select at least one payment term";
    }

    return nextErrors;
  };

  const updateSupplierField = (field, value) => {
    setSupplier((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const toggleChemical = (chemical) => {
    setSupplier((prev) => ({
      ...prev,
      chemicals: toggleItem(prev.chemicals, chemical),
    }));
  };

  const togglePaymentTerm = (term) => {
    setSupplier((prev) => ({
      ...prev,
      paymentTerms: toggleItem(prev.paymentTerms, term),
    }));

    setErrors((prev) => {
      if (!prev.paymentTerms) {
        return prev;
      }

      const nextErrors = { ...prev };
      delete nextErrors.paymentTerms;
      return nextErrors;
    });
  };

  const skipStep = () => {
    navigate("/onboarding/step6");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showError("Please fix errors");
      return;
    }

    if (!supplier.chemicals.length) {
      console.warn("No chemicals selected for supplier.");
    }

    if (!companyId) {
      showError("Company ID missing");
      return;
    }

    const toastId = showLoading("Saving supplier...");

    try {
      setLoading(true);

      const payload = {
        companyName: supplier.companyName,
        supplierType: supplier.supplierType,
        city: supplier.city,
        country: supplier.country,

        contactPerson: supplier.contactPerson,
        designation: supplier.designation,
        email: supplier.email,
        phone: supplier.phone,

        minOrder: supplier.minOrder,
        leadTime: supplier.leadTime,
        reliability: supplier.reliability,

        paymentTerms: supplier.paymentTerms,
        rating: supplier.rating,
        notes: supplier.notes,
      };

      const res = await createSupplier(companyId, payload);

      if (res.success) {
        updateToast(toastId, "Supplier saved", "success");
        clearOnboardingStorage();
        navigate("/onboarding/step6");
        return;
      }

      updateToast(toastId, res.message, "error");
    } catch (err) {
      console.error(err);
      updateToast(toastId, "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="step5">
      <TopBar variant="secure" />
      <ProgressBar currentStep={5} />

      <div className="main-wrap">
        <div className="form-container">
          <div className="step-header">
            <div className="step-badge">
              <i className="bi bi-truck"></i> Step 5 of 6 · Optional
            </div>

            <h2 className="step-title">Add Your First Supplier</h2>

            <p className="step-sub">
              Add a key supplier you source chemicals from. This is optional -
              you can add and manage all suppliers later from the Suppliers
              module.
            </p>
          </div>

          <div className="skip-banner">
            <i className="bi bi-info-circle-fill skip-banner-icon"></i>
            <div className="skip-banner-text">
              <strong>This step is optional</strong>
              You can add suppliers anytime from the Suppliers module after
              setup.
            </div>
            <button type="button" className="btn-skip" onClick={skipStep}>
              Skip this step →
            </button>
          </div>

          <form noValidate onSubmit={handleSubmit}>
            <SupplierCompany
              supplier={supplier}
              updateSupplierField={updateSupplierField}
              errors={errors}
            />

            <PrimaryContact
              supplier={supplier}
              updateSupplierField={updateSupplierField}
              errors={errors}
            />

            <SupplierChemicals
              availableChemicals={onboardingChemicals}
              selectedChemicals={supplier.chemicals}
              onToggle={toggleChemical}
            />

            <SupplyTerms
              supplier={supplier}
              updateSupplierField={updateSupplierField}
              togglePaymentTerm={togglePaymentTerm}
              errors={errors}
            />

            <SupplierRating
              rating={supplier.rating}
              notes={supplier.notes}
              updateSupplierField={updateSupplierField}
            />

            <div className="form-actions">
              <button
                type="button"
                className="btn-back"
                onClick={() => navigate("/onboarding/step4")}
              >
                <i className="bi bi-arrow-left"></i> Back
              </button>

              <button type="submit" className="btn-next" disabled={loading}>
                {loading ? "Saving..." : "Save & Continue"}{" "}
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step5Supplier;
