import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { compareQuotationVersions } from "../../features/quotations/api/quotations.api";
import CompareChangeLogTable from "../../features/quotations/components/compare/CompareChangeLogTable";
import CompareColumn from "../../features/quotations/components/compare/CompareColumn";
import CompareSummaryCards from "../../features/quotations/components/compare/CompareSummaryCards";
import VersionSelectorBar from "../../features/quotations/components/compare/VersionSelectorBar";
import { quotationVersionAdapterNotice } from "../../features/quotations/mocks/quotationVersionMock";
import {
  getCompareSections,
  getCompareSummaryCards,
  getVersionLabel,
} from "../../features/quotations/utils/quotationCompareUtils";
import { getCompanyId } from "../../utils/company";

const QuotationCompareVersionsPage = () => {
  const { publicId } = useParams();
  const [data, setData] = useState(null);
  const [leftVersionId, setLeftVersionId] = useState("current");
  const [rightVersionId, setRightVersionId] = useState("v1");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCompare = useCallback(async () => {
    const companyId = getCompanyId();

    if (!companyId) {
      setError("Company ID missing. Please complete onboarding first.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await compareQuotationVersions(publicId, {
        companyId,
        v1: leftVersionId,
        v2: rightVersionId,
      });
      setData(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to compare quotation versions",
      );
    } finally {
      setIsLoading(false);
    }
  }, [leftVersionId, publicId, rightVersionId]);

  useEffect(() => {
    loadCompare();
  }, [loadCompare]);

  const sections = useMemo(() => {
    if (!data?.left || !data?.right) {
      return [];
    }

    return getCompareSections(data.left, data.right);
  }, [data]);

  if (isLoading) {
    return <div className="lead-detail-loading">Loading version comparison...</div>;
  }

  if (error || !data) {
    return (
      <div className="lead-detail-empty">
        <i className="bi bi-columns-gap" aria-hidden="true"></i>
        <h2>Compare unavailable</h2>
        <p>{error || "This quotation comparison could not be loaded."}</p>
        <Link to="/dashboard/quotations" className="lead-button lead-button-primary">
          Back to Quotations
        </Link>
      </div>
    );
  }

  const quotation = data.quotation;
  const left = {
    ...data.left,
    compareAgainst: data.right,
  };
  const right = {
    ...data.right,
    compareAgainst: data.left,
  };
  const summaryCards = getCompareSummaryCards(
    data.comparison,
    quotation.currency || "USD",
  );

  return (
    <div className="quotation-compare-page">
      <div className="lead-breadcrumb-bar quotation-compare-header">
        <nav className="lead-breadcrumb" aria-label="Breadcrumb">
          <Link to="/dashboard/quotations">
            <i className="bi bi-file-earmark-text" aria-hidden="true"></i>
            Quotations
          </Link>
          <span className="lead-breadcrumb-separator">/</span>
          <Link to={`/dashboard/quotations/${publicId}`}>{quotation.quotationNumber}</Link>
          <span className="lead-breadcrumb-separator">/</span>
          <span>Compare Versions</span>
        </nav>
        <div className="quotation-detail-actions">
          <button
            type="button"
            className="lead-button lead-button-secondary"
            onClick={() => window.alert("Create revision workflow is not connected yet.")}
          >
            <i className="bi bi-pencil-square" aria-hidden="true"></i>
            Create New Revision
          </button>
          <Link
            to={`/dashboard/quotations/${publicId}/preview`}
            className="lead-button lead-button-primary"
          >
            <i className="bi bi-filetype-pdf" aria-hidden="true"></i>
            Export Current PDF
          </Link>
        </div>
      </div>

      <VersionSelectorBar
        leftVersionId={leftVersionId}
        rightVersionId={rightVersionId}
        versions={data.versions}
        onLeftChange={setLeftVersionId}
        onRightChange={setRightVersionId}
      />

      <div className="quotation-compare-note">
        <i className="bi bi-info-circle" aria-hidden="true"></i>
        {quotationVersionAdapterNotice}
      </div>

      <CompareSummaryCards
        cards={summaryCards}
        title={`What Changed - ${getVersionLabel(data.right)} to ${getVersionLabel(data.left)}`}
      />

      <section className="quotation-compare-grid">
        <CompareColumn
          badge={data.left.isCurrent ? "Current" : "Selected"}
          mode="current"
          sections={sections}
          version={left}
        />
        <CompareColumn
          badge={data.right.isCurrent ? "Current" : "Superseded"}
          mode="older"
          sections={sections}
          version={right}
        />
      </section>

      <CompareChangeLogTable
        changes={data.comparison.changes}
        leftLabel={getVersionLabel(data.left)}
        rightLabel={getVersionLabel(data.right)}
      />
    </div>
  );
};

export default QuotationCompareVersionsPage;
