import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getQuotationByPublicId,
  reviseQuotation,
} from "../../features/quotations/api/quotations.api";
import QuotationFormLayout from "../../features/quotations/components/form/QuotationFormLayout";
import { createQuotationStateFromDetail } from "../../features/quotations/constants/quotationDefaults";
import { formatQuotationDate } from "../../features/quotations/utils/quotationDisplayUtils";
import { getCompanyId } from "../../utils/company";

const ReviseQuotationPage = () => {
  const { publicId } = useParams();
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const companyId = getCompanyId();

    const loadQuotation = async () => {
      if (!companyId) {
        setError("Company ID missing. Please complete onboarding first.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getQuotationByPublicId(publicId, { companyId });

        if (isMounted) {
          setDetail(response.data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load quotation for revision",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadQuotation();

    return () => {
      isMounted = false;
    };
  }, [publicId]);

  const initialData = useMemo(() => {
    if (!detail) {
      return null;
    }

    return createQuotationStateFromDetail(detail, {
      mode: "revise",
      revisionNotes: `Revision from v${detail.quotation.versionNumber ?? 1}`,
    });
  }, [detail]);

  if (isLoading) {
    return <div className="lead-detail-loading">Loading quotation revision...</div>;
  }

  if (error || !detail) {
    return (
      <div className="lead-detail-empty">
        <i className="bi bi-pencil-square" aria-hidden="true"></i>
        <h2>Revision unavailable</h2>
        <p>{error || "This quotation could not be loaded for revision."}</p>
        <Link to="/dashboard/quotations" className="lead-button lead-button-primary">
          Back to Quotations
        </Link>
      </div>
    );
  }

  const { quotation } = detail;
  const nextVersion = (quotation.versionNumber ?? 1) + 1;

  return (
    <QuotationFormLayout
      breadcrumbLabel={`Revise ${quotation.quotationNumber}`}
      cancelTo={`/dashboard/quotations/${quotation.publicId}`}
      draftLabel="Save Revision Draft"
      getTargetPath={(savedQuotation) =>
        `/dashboard/quotations/${savedQuotation.publicId}`
      }
      heroSubtitle={`${quotation.quotationNumber} - creating revision v${nextVersion} from v${quotation.versionNumber ?? 1}`}
      heroTitle="Revising Quotation"
      initialData={initialData}
      mode="revise"
      previewEnabled={false}
      primaryLabel="Save & Send Revision"
      onSave={({ companyId, quotationForm, saveMode }) =>
        reviseQuotation(publicId, {
          companyId,
          quotationForm,
          revisionNotes:
            quotationForm.metadata?.revisionNotes ||
            `Revision from v${quotation.versionNumber ?? 1}`,
          saveMode,
        })
      }
      saveSuccessFallback="Quotation revision created successfully"
    >
      <section className="quotation-revision-banner">
        <div>
          <span className="quotation-status-pill revision">
            <i className="bi bi-arrow-repeat" aria-hidden="true"></i>
            Revision
          </span>
          <h2>{quotation.quotationNumber}</h2>
          <p>
            Creating revision v{nextVersion} from v{quotation.versionNumber ?? 1}.
            Original quotation will remain unchanged.
          </p>
        </div>
        <div className="quotation-revision-meta">
          <span>Source version</span>
          <strong>v{quotation.versionNumber ?? 1}</strong>
          <small>{formatQuotationDate(quotation.updatedAt || quotation.createdAt)}</small>
        </div>
      </section>
    </QuotationFormLayout>
  );
};

export default ReviseQuotationPage;
