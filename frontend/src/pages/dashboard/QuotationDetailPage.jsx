import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getQuotationByPublicId } from "../../features/quotations/api/quotations.api";
import QuotationFinancialSummary from "../../features/quotations/components/detail/QuotationFinancialSummary";
import QuotationHero from "../../features/quotations/components/detail/QuotationHero";
import QuotationItemsTable from "../../features/quotations/components/detail/QuotationItemsTable";
import QuotationSummaryCards from "../../features/quotations/components/detail/QuotationSummaryCards";
import QuotationTradeTerms from "../../features/quotations/components/detail/QuotationTradeTerms";
import {
  formatQuotationMoney,
  formatQuotationDate,
} from "../../features/quotations/utils/quotationDisplayUtils";
import { getCompanyId } from "../../utils/company";

const showPendingAction = (label) => {
  window.alert(`${label} action is not connected yet.`);
};

const getDocuments = (quotation) => {
  const documents = quotation.metadata?.documents;

  if (!Array.isArray(documents)) {
    return [];
  }

  return documents
    .map((document) => {
      if (typeof document === "string") {
        return { id: document, label: document, included: true };
      }

      return {
        id: document.id || document.label || document.name,
        label: document.label || document.name || document.id,
        included: document.included ?? document.selected ?? true,
      };
    })
    .filter((document) => document.id || document.label);
};

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

  const { lead, quotation, items, versionHistory = [] } = detail;
  const documents = getDocuments(quotation);

  return (
    <div className="quotation-detail-page">
      <div className="lead-breadcrumb-bar">
        <nav className="lead-breadcrumb" aria-label="Breadcrumb">
          <Link to="/dashboard/quotations">
            <i className="bi bi-file-earmark-text" aria-hidden="true"></i>
            Quotations
          </Link>
          <span className="lead-breadcrumb-separator">/</span>
          <span>
            {quotation.quotationNumber}
            {quotation.companyName ? ` - ${quotation.companyName}` : ""}
          </span>
        </nav>
        <div className="quotation-detail-actions">
          <Link
            to={`/dashboard/quotations/${quotation.publicId}/compare`}
            className="lead-button lead-button-secondary"
          >
            <i className="bi bi-columns-gap" aria-hidden="true"></i>
            Compare Versions
          </Link>
          <Link
            to={`/dashboard/quotations/${quotation.publicId}/preview`}
            className="lead-button lead-button-secondary"
          >
            <i className="bi bi-filetype-pdf" aria-hidden="true"></i>
            PDF Preview
          </Link>
          <Link
            to={`/dashboard/quotations/${quotation.publicId}/revise`}
            className="lead-button lead-button-secondary"
          >
            <i className="bi bi-pencil-square" aria-hidden="true"></i>
            Revise
          </Link>
          <button
            type="button"
            className="lead-button lead-button-primary"
            onClick={() => showPendingAction("Send")}
          >
            <i className="bi bi-send-fill" aria-hidden="true"></i>
            Resend
          </button>
        </div>
      </div>

      <QuotationHero quotation={quotation} />
      <QuotationSummaryCards quotation={quotation} />

      <div className="quotation-detail-grid">
        <main className="quotation-detail-main">
          <QuotationTradeTerms quotation={quotation} />
          <QuotationItemsTable currency={quotation.currency} items={items} />
          <QuotationFinancialSummary quotation={quotation} />
          <section className="quotation-section">
            <header className="quotation-section-header">
              <span className="quotation-section-icon">
                <i className="bi bi-chat-square-text-fill" aria-hidden="true"></i>
              </span>
              <div>
                <h2>Remarks & Terms</h2>
                <p>Client-facing remarks and private internal notes.</p>
              </div>
            </header>
            <div className="quotation-detail-notes">
              <p>{quotation.remarks || "No client remarks added."}</p>
              <div className="quotation-internal-note">
                <strong>Internal Notes</strong>
                <span>{quotation.internalNotes || "No internal notes added."}</span>
              </div>
            </div>
          </section>
        </main>
        <aside className="quotation-detail-sidebar">
          <section className="quotation-section quotation-decision-card">
            <header className="quotation-section-header">
              <span className="quotation-section-icon">
                <i className="bi bi-check2-circle" aria-hidden="true"></i>
              </span>
              <div>
                <h2>Client Decision</h2>
                <p>Update the quotation outcome after client feedback.</p>
              </div>
            </header>
            <div className="quotation-section-body quotation-decision-actions">
              <button
                type="button"
                className="lead-button quotation-accept-button"
                onClick={() => showPendingAction("Mark as Accepted")}
              >
                <i className="bi bi-check-circle-fill" aria-hidden="true"></i>
                Mark as Accepted
              </button>
              <button
                type="button"
                className="lead-button quotation-reject-button"
                onClick={() => showPendingAction("Mark as Rejected")}
              >
                <i className="bi bi-x-circle-fill" aria-hidden="true"></i>
                Mark as Rejected
              </button>
            </div>
          </section>

          <section className="quotation-section">
            <header className="quotation-section-header">
              <span className="quotation-section-icon">
                <i className="bi bi-paperclip" aria-hidden="true"></i>
              </span>
              <div>
                <h2>Documents in Quotation</h2>
                <p>Attachments selected on this saved quotation.</p>
              </div>
            </header>
            <div className="quotation-section-body quotation-document-list">
              {documents.length > 0 ? (
                documents.map((document) => (
                  <div
                    key={document.id || document.label}
                    className={document.included ? "included" : ""}
                  >
                    <i
                      className={`bi ${
                        document.included ? "bi-check-circle-fill" : "bi-dash-circle"
                      }`}
                      aria-hidden="true"
                    ></i>
                    <span>{document.label}</span>
                  </div>
                ))
              ) : (
                <div>
                  <i className="bi bi-dash-circle" aria-hidden="true"></i>
                  <span>No documents selected.</span>
                </div>
              )}
            </div>
          </section>

          <section className="quotation-section">
            <header className="quotation-section-header">
              <span className="quotation-section-icon">
                <i className="bi bi-lightning-fill" aria-hidden="true"></i>
              </span>
              <div>
                <h2>Quick Actions</h2>
                <p>Common quotation follow-ups.</p>
              </div>
            </header>
            <div className="quotation-section-body quotation-quick-actions">
              <button
                type="button"
                className="lead-button lead-button-secondary"
                onClick={() => showPendingAction("Resend to Client")}
              >
                <i className="bi bi-send" aria-hidden="true"></i>
                Resend to Client
              </button>
              <Link
                to={`/dashboard/quotations/${quotation.publicId}/revise`}
                className="lead-button lead-button-secondary"
              >
                <i className="bi bi-pencil-square" aria-hidden="true"></i>
                Create Revision
              </Link>
              <Link
                to={`/dashboard/quotations/${quotation.publicId}/preview`}
                className="lead-button lead-button-secondary"
              >
                <i className="bi bi-filetype-pdf" aria-hidden="true"></i>
                Download PDF
              </Link>
              <Link
                to={`/dashboard/quotations/${quotation.publicId}/compare`}
                className="lead-button lead-button-secondary"
              >
                <i className="bi bi-columns-gap" aria-hidden="true"></i>
                Compare Versions
              </Link>
              {lead?.publicId ? (
                <Link
                  to={`/dashboard/leads/${lead.publicId}`}
                  className="lead-button lead-button-secondary"
                >
                  <i className="bi bi-funnel" aria-hidden="true"></i>
                  View Lead
                </Link>
              ) : null}
            </div>
          </section>

          <section className="quotation-section quotation-side-total">
            <header className="quotation-section-header">
              <span className="quotation-section-icon">
                <i className="bi bi-cash-stack" aria-hidden="true"></i>
              </span>
              <div>
                <h2>Total</h2>
                <p>{quotation.currency || "Currency"} quotation value.</p>
              </div>
            </header>
            <div className="quotation-section-body">
              <strong>
                {formatQuotationMoney(quotation.grandTotal, quotation.currency)}
              </strong>
            </div>
          </section>

          <section className="quotation-section">
            <header className="quotation-section-header">
              <span className="quotation-section-icon">
                <i className="bi bi-clock-history" aria-hidden="true"></i>
              </span>
              <div>
                <h2>Version History</h2>
                <p>Revision lineage for this quotation.</p>
              </div>
            </header>
            <div className="quotation-section-body quotation-version-history">
              {versionHistory.length > 0 ? (
                versionHistory.map((version) => (
                  <Link
                    key={version.publicId}
                    to={`/dashboard/quotations/${version.publicId}`}
                    className={version.isLatestVersion ? "latest" : ""}
                  >
                    <span>v{version.versionNumber}</span>
                    <strong>{version.status}</strong>
                    <small>
                      {formatQuotationDate(version.createdAt)}
                      {version.createdBy ? ` - ${version.createdBy}` : ""}
                    </small>
                  </Link>
                ))
              ) : (
                <div className="quotation-version-empty">v1 - No revisions yet.</div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default QuotationDetailPage;
