import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getQuotationByPublicId } from "../../features/quotations/api/quotations.api";
import QuotationFinancialSummary from "../../features/quotations/components/detail/QuotationFinancialSummary";
import QuotationHero from "../../features/quotations/components/detail/QuotationHero";
import QuotationItemsTable from "../../features/quotations/components/detail/QuotationItemsTable";
import QuotationSummaryCards from "../../features/quotations/components/detail/QuotationSummaryCards";
import QuotationTradeTerms from "../../features/quotations/components/detail/QuotationTradeTerms";
import { getCompanyId } from "../../utils/company";

const QuotationDetailPage = () => {
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
              "Unable to load quotation details",
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

  if (isLoading) {
    return <div className="lead-detail-loading">Loading quotation...</div>;
  }

  if (error || !detail) {
    return (
      <div className="lead-detail-empty">
        <i className="bi bi-file-earmark-text" aria-hidden="true"></i>
        <h2>Quotation not found</h2>
        <p>{error || "This quotation could not be loaded."}</p>
        <Link to="/dashboard/quotations" className="lead-button lead-button-primary">
          Back to Quotations
        </Link>
      </div>
    );
  }

  const { quotation, items } = detail;

  return (
    <div className="quotation-detail-page">
      <div className="lead-breadcrumb-bar">
        <nav className="lead-breadcrumb" aria-label="Breadcrumb">
          <Link to="/dashboard/quotations">
            <i className="bi bi-file-earmark-text" aria-hidden="true"></i>
            Quotations
          </Link>
          <span className="lead-breadcrumb-separator">/</span>
          <span>{quotation.quotationNumber}</span>
        </nav>
        <div className="quotation-detail-actions">
          <button type="button" className="lead-button lead-button-secondary">
            Edit
          </button>
          <button type="button" className="lead-button lead-button-secondary">
            Generate PDF
          </button>
          <button type="button" className="lead-button lead-button-primary">
            Send
          </button>
        </div>
      </div>

      <QuotationHero quotation={quotation} />
      <QuotationSummaryCards quotation={quotation} />

      <div className="quotation-detail-grid">
        <main className="quotation-detail-main">
          <QuotationItemsTable currency={quotation.currency} items={items} />
          <QuotationTradeTerms quotation={quotation} />
          <section className="quotation-section">
            <header className="quotation-section-header">
              <span className="quotation-section-icon">
                <i className="bi bi-chat-square-text-fill" aria-hidden="true"></i>
              </span>
              <h2>Remarks</h2>
            </header>
            <div className="quotation-detail-notes">
              <p>{quotation.remarks || "No client remarks added."}</p>
              <small>{quotation.internalNotes || "No internal notes added."}</small>
            </div>
          </section>
        </main>
        <aside className="quotation-detail-sidebar">
          <QuotationFinancialSummary quotation={quotation} />
        </aside>
      </div>
    </div>
  );
};

export default QuotationDetailPage;
