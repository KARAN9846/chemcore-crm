import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/layout/TopBar";
import ProgressBar from "../../components/onboarding/layout/ProgressBar";
import PrimaryContact from "../../components/onboarding/supplier/PrimaryContact";
import SupplierChemicals from "../../components/onboarding/supplier/SupplierChemicals";
import SupplierCompany from "../../components/onboarding/supplier/SupplierCompany";
import SupplierRating from "../../components/onboarding/supplier/SupplierRating";
import SupplyTerms from "../../components/onboarding/supplier/SupplyTerms";
import { advanceOnboardingStep } from "../../api/onboarding.api";
import {
  getChemicals,
  getSupplier,
} from "../../api/onboardingHydration.api";
import { createSupplier } from "../../api/supplier.api";
import { useOnboarding } from "../../context/useOnboarding";
import { getCompanyId } from "../../utils/company";
import { ONBOARDING_KEYS } from "../../utils/onboardingStorage";
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

const normalizePaymentTerms = (paymentTerms) => {
  if (Array.isArray(paymentTerms)) {
    return paymentTerms;
  }

  if (typeof paymentTerms === "string" && paymentTerms.trim()) {
    return paymentTerms
      .replace(/[{}"]/g, "")
      .split(",")
      .map((term) => term.trim())
      .filter(Boolean);
  }

  return [];
};

const mapSupplierResponseToForm = (supplier = {}) => ({
  companyName: supplier.company_name || "",
  supplierType: supplier.supplier_type || "manufacturer",
  city: supplier.city || "",
  country: supplier.country || "IN",
  contactPerson: supplier.contact_person || "",
  designation: supplier.designation || "",
  email: supplier.email || "",
  phone: supplier.phone || "",
  chemicals: [],
  minOrder: supplier.min_order || "",
  leadTime: supplier.lead_time || "",
  reliability: supplier.reliability || "High",
  paymentTerms: normalizePaymentTerms(supplier.payment_terms),
  rating: Number(supplier.rating) || 0,
  notes: supplier.notes || "",
});

const Step5Supplier = () => {
  const navigate = useNavigate();
  const {
    onboardingChemicals,
    setCurrentStep,
    setOnboardingChemicals,
  } = useOnboarding();
  const [supplier, setSupplier] = useState(initialSupplier);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const hydrateSupplier = async () => {
      console.log("HDRATING STEP 5");
      setHydrating(true);

      try {
        const activeCompanyId = getCompanyId();

        if (!activeCompanyId) {
          return;
        }

        const [supplierResponse, chemicalsResponse] = await Promise.all([
          getSupplier(activeCompanyId),
          getChemicals(activeCompanyId),
        ]);
        const savedSupplier = supplierResponse?.data || null;
        const savedChemicals = Array.isArray(chemicalsResponse?.data)
          ? chemicalsResponse.data
          : [];

        console.log("FETCHED DATA:", savedSupplier);

        if (isMounted && savedChemicals.length > 0) {
          setOnboardingChemicals(
            savedChemicals.map((chemical) => ({
              id: chemical.id,
              name: chemical.name || "",
              formula: chemical.formula || "",
              category: chemical.category || "",
              hsCode: chemical.hs_code || "",
              unit: chemical.unit || "MT",
              icon: "\u2697\uFE0F",
            })),
          );
        }

        if (isMounted && savedSupplier) {
          console.log("SETTING FORM STATE");
          setSupplier(mapSupplierResponseToForm(savedSupplier));
        }
      } catch (error) {
        console.error("Supplier hydration error:", error);
      } finally {
        if (isMounted) {
          setHydrating(false);
        }
      }
    };

    hydrateSupplier();

    return () => {
      isMounted = false;
    };
  }, [setOnboardingChemicals]);

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

  const skipStep = async (event) => {
    console.log("BUTTON CLICK");
    event?.preventDefault();
    event?.stopPropagation();

    if (loading) {
      return;
    }

    const activeCompanyId = getCompanyId();

    if (!activeCompanyId) {
      showError("Company ID missing");
      return;
    }

    try {
      setLoading(true);
      console.log("SAVE START");

      const skipRes = await advanceOnboardingStep(activeCompanyId, 6);

      if (skipRes?.success === false) {
        throw new Error(skipRes.message || "Unable to finish onboarding.");
      }

      console.log("SAVE COMPLETE");
      localStorage.setItem(ONBOARDING_KEYS.STEP, "6");
      setCurrentStep(6);
      console.log("NAVIGATE START");
      navigate("/onboarding/step6");
    } catch (error) {
      console.error("Supplier skip error:", error);
      showError("Unable to finish onboarding right now");
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    console.log("BUTTON CLICK");
    event?.preventDefault();
    event?.stopPropagation();

    if (loading) {
      return;
    }

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showError("Please fix errors");
      return;
    }

    if (!supplier.chemicals.length) {
      console.warn("No chemicals selected for supplier.");
    }

    const activeCompanyId = getCompanyId();
    console.log("ACTIVE COMPANY ID:", activeCompanyId);

    if (!activeCompanyId) {
      showError("Company ID missing");
      return;
    }

    const toastId = showLoading("Saving supplier...");

    try {
      setLoading(true);
      console.log("SAVE START");

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

      const supplierRes = await createSupplier(activeCompanyId, payload);

      if (supplierRes?.success === false) {
        throw new Error(supplierRes.message || "Unable to save supplier.");
      }

      console.log("SAVE COMPLETE");
      localStorage.setItem(ONBOARDING_KEYS.STEP, "6");
      setCurrentStep(6);
      updateToast(toastId, "Supplier saved", "success");
      console.log("NAVIGATE START");
      navigate("/onboarding/step6");
    } catch (err) {
      console.error(err);
      updateToast(toastId, err.message || "Something went wrong", "error");
      setLoading(false);
    }
  };

  if (hydrating) {
    return null;
  }

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

          <form
            noValidate
            onSubmit={(event) => {
              console.log("FORM SUBMIT");
              event.preventDefault();
              event.stopPropagation();
            }}
          >
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

              <button
                type="button"
                className="btn-next"
                onClick={handleSubmit}
                disabled={loading}
              >
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
