import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getQuotationByPublicId } from "../../features/quotations/api/quotations.api";
import QuotationPdfDocuments from "../../features/quotations/components/preview/QuotationPdfDocuments";
import QuotationPdfFooter from "../../features/quotations/components/preview/QuotationPdfFooter";
import QuotationPdfHeader from "../../features/quotations/components/preview/QuotationPdfHeader";
import QuotationPdfItemsTable from "../../features/quotations/components/preview/QuotationPdfItemsTable";
import QuotationPdfParties from "../../features/quotations/components/preview/QuotationPdfParties";
import QuotationPdfRemarks from "../../features/quotations/components/preview/QuotationPdfRemarks";
import QuotationPdfSignature from "../../features/quotations/components/preview/QuotationPdfSignature";
import QuotationPdfTerms from "../../features/quotations/components/preview/QuotationPdfTerms";
import QuotationPdfTotals from "../../features/quotations/components/preview/QuotationPdfTotals";
import QuotationPreviewToolbar from "../../features/quotations/components/preview/QuotationPreviewToolbar";
import {
  getPrimaryQuotationSummary,
  getQuotationCompanyProfile,
  getSelectedQuotationDocuments,
  withPdfDocumentTitle,
} from "../../features/quotations/utils/quotationPdfUtils";
import { getCompanyId } from "../../utils/company";
import { showSuccess } from "../../utils/toast";

const QuotationPreviewPage = () => {
  const { publicId } = useParams();
  const paperRef = useRef(null);
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
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
              "Unable to load quotation preview",
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

  const company = useMemo(() => getQuotationCompanyProfile(), []);

  const handlePrint = useCallback(() => {
    if (!detail?.quotation) return;

    withPdfDocumentTitle(detail.quotation, () => window.print());
  }, [detail]);

  const handleDownload = useCallback(() => {
    if (!detail?.quotation) return;

    setIsDownloading(true);
    withPdfDocumentTitle(detail.quotation, () => window.print());
    window.setTimeout(() => setIsDownloading(false), 600);
  }, [detail]);

  if (isLoading) {
    return <div className="lead-detail-loading">Loading quotation preview...</div>;
  }

  if (error || !detail) {
    return (
      <div className="lead-detail-empty">
        <i className="bi bi-file-earmark-pdf" aria-hidden="true"></i>
        <h2>Preview unavailable</h2>
        <p>{error || "This quotation could not be loaded."}</p>
        <Link to="/dashboard/quotations" className="lead-button lead-button-primary">
          Back to Quotations
        </Link>
      </div>
    );
  }

  const { quotation, items } = detail;
  const documents = getSelectedQuotationDocuments(quotation);
  const summary = getPrimaryQuotationSummary({ items, quotation });
  const detailPath = `/dashboard/quotations/${quotation.publicId}`;

  return (
    <div className="quotation-preview-page">
      <QuotationPreviewToolbar
        detailPath={detailPath}
        isDownloading={isDownloading}
        quotation={quotation}
        summary={summary}
        onDownload={handleDownload}
        onPrint={handlePrint}
        onSend={() => showSuccess("Send to client workflow will be connected next")}
      />

      <main className="quotation-preview-wrap">
        <article ref={paperRef} className="quotation-pdf-paper">
          <div className="quotation-pdf-watermark">Quotation</div>
          <div className="quotation-pdf-page">
            <QuotationPdfHeader company={company} quotation={quotation} />
            <QuotationPdfParties company={company} quotation={quotation} />
            <QuotationPdfItemsTable currency={quotation.currency} items={items} />
            <QuotationPdfTotals quotation={quotation} />
            <QuotationPdfTerms quotation={quotation} />
            <QuotationPdfRemarks quotation={quotation} />
            <QuotationPdfDocuments documents={documents} />
            <QuotationPdfSignature company={company} quotation={quotation} />
          </div>
          <QuotationPdfFooter company={company} quotation={quotation} />
        </article>
      </main>
    </div>
  );
};

export default QuotationPreviewPage;
