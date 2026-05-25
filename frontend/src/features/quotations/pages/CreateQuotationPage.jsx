import { useLocation } from "react-router-dom";

import { createQuotation } from "../api/quotations.api";
import QuotationFormLayout from "../components/form/QuotationFormLayout";

const CreateQuotationPage = () => {
  const { state } = useLocation();

  return (
    <QuotationFormLayout
      breadcrumbLabel="New Quotation"
      getTargetPath={(quotation, destination) =>
        destination === "preview"
          ? `/dashboard/quotations/${quotation.publicId}/preview`
          : `/dashboard/quotations/${quotation.publicId}`
      }
      heroTitle="Create Quotation"
      initialData={state?.quotationPrefill}
      mode="create"
      onSave={({ companyId, quotationForm }) =>
        createQuotation({
          companyId,
          quotationForm,
        })
      }
      saveSuccessFallback="Quotation created successfully"
    />
  );
};

export default CreateQuotationPage;
