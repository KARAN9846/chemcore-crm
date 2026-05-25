import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  deleteQuotation,
  getQuotations,
} from "../../features/quotations/api/quotations.api";
import {
  formatQuotationDate,
  formatQuotationMoney,
  formatQuotationPercent,
} from "../../features/quotations/utils/quotationDisplayUtils";
import { getCompanyId } from "../../utils/company";
import { showError, showSuccess } from "../../utils/toast";

const QUOTATION_PAGE_LIMIT = 10;

const STATUS_OPTIONS = ["Draft", "Sent", "Revised", "Accepted", "Rejected", "Expired"];

const SUMMARY_CARDS = [
  { key: "allOpen", label: "All Open", icon: "bi-folder2-open", tone: "open" },
  { key: "draft", label: "Draft", icon: "bi-pencil", tone: "draft", status: "Draft" },
  { key: "sent", label: "Sent", icon: "bi-send-fill", tone: "sent", status: "Sent" },
  {
    key: "revised",
    label: "Revised",
    icon: "bi-arrow-clockwise",
    tone: "revised",
    status: "Revised",
  },
  {
    key: "accepted",
    label: "Accepted",
    icon: "bi-check-circle-fill",
    tone: "accepted",
    status: "Accepted",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: "bi-x-circle-fill",
    tone: "rejected",
    status: "Rejected",
  },
  {
    key: "expiringSoon",
    label: "Expiring Soon",
    icon: "bi-clock-fill",
    tone: "expiring",
  },
  {
    key: "openValue",
    label: "Open Value",
    icon: "bi-cash-stack",
    tone: "value",
    isMoney: true,
  },
];

const SORT_OPTIONS = [
  { label: "Sort: Date ↓", sortBy: "quotationDate", sortDir: "desc" },
  { label: "Sort: Value ↓", sortBy: "value", sortDir: "desc" },
  { label: "Sort: Expiry ↑", sortBy: "validUntil", sortDir: "asc" },
  { label: "Sort: Margin ↓", sortBy: "margin", sortDir: "desc" },
  { label: "Sort: Client A-Z", sortBy: "client", sortDir: "asc" },
];

const statusIconMap = {
  Draft: "bi-pencil",
  Sent: "bi-send-fill",
  Revised: "bi-arrow-clockwise",
  Accepted: "bi-check-circle-fill",
  Rejected: "bi-x-circle-fill",
  Expired: "bi-exclamation-circle-fill",
};

const getUniqueOptions = (rows, getter) =>
  Array.from(new Set(rows.map(getter).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );

const getExpiryMeta = (quotation) => {
  if (quotation.status === "Accepted") {
    return { label: "Order placed", tone: "accepted", icon: "bi-check-circle-fill" };
  }

  if (!quotation.validUntil || quotation.status === "Draft") {
    return { label: "Not sent", tone: "muted", icon: "" };
  }

  const today = new Date();
  const expiry = new Date(quotation.validUntil);
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const days = Math.ceil((expiry - today) / 86400000);

  if (days < 0 || quotation.status === "Expired") {
    return { label: "Expired", tone: "expired", icon: "bi-exclamation-circle-fill" };
  }

  if (days <= 3) {
    return { label: `${days} days`, tone: "urgent", icon: "bi-clock-fill" };
  }

  if (days <= 10) {
    return { label: `${days} days`, tone: "soon", icon: "bi-clock-fill" };
  }

  return { label: `${days} days`, tone: "ok", icon: "bi-check-circle-fill" };
};

const getMarginTone = (value) => {
  const margin = Number(value);

  if (margin >= 18) return "high";
  if (margin >= 12) return "medium";
  return "low";
};

const showPendingAction = (label) => {
  window.alert(`${label} action is not connected yet.`);
};

const QuotationsPage = () => {
  const navigate = useNavigate();
  const companyId = getCompanyId();
  const [quotations, setQuotations] = useState([]);
  const [summary, setSummary] = useState({
    allOpen: 0,
    draft: 0,
    sent: 0,
    revised: 0,
    accepted: 0,
    rejected: 0,
    expiringSoon: 0,
    openValue: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: QUOTATION_PAGE_LIMIT,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState({
    search: "",
    chemical: "",
    status: "",
    owner: "",
    sortBy: "quotationDate",
    sortDir: "desc",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadQuotations = useCallback(
    async (page = 1) => {
      if (!companyId) {
        setError("Company ID missing. Please complete onboarding first.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await getQuotations({
          companyId,
          page,
          limit: QUOTATION_PAGE_LIMIT,
          search: filters.search || undefined,
          chemical: filters.chemical || undefined,
          status: filters.status || undefined,
          owner: filters.owner || undefined,
          sortBy: filters.sortBy,
          sortDir: filters.sortDir,
        });

        setQuotations(response.data ?? []);
        setSummary((current) => ({ ...current, ...(response.summary ?? {}) }));
        setPagination({
          page: response.pagination?.page ?? page,
          limit: response.pagination?.limit ?? QUOTATION_PAGE_LIMIT,
          total: response.pagination?.total ?? 0,
          totalPages: response.pagination?.totalPages ?? 1,
          hasNextPage: Boolean(response.pagination?.hasNextPage),
          hasPrevPage: Boolean(response.pagination?.hasPrevPage),
        });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load quotations right now",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      companyId,
      filters.chemical,
      filters.owner,
      filters.search,
      filters.sortBy,
      filters.sortDir,
      filters.status,
    ],
  );

  useEffect(() => {
    loadQuotations(1);
  }, [loadQuotations]);

  const filterOptions = useMemo(
    () => ({
      chemicals: getUniqueOptions(quotations, (quotation) => quotation.primaryChemical),
      owners: getUniqueOptions(quotations, (quotation) => quotation.createdBy),
    }),
    [quotations],
  );

  const updateFilter = (field) => (event) => {
    const value = event.target.value;

    if (field === "sort") {
      const option = SORT_OPTIONS[Number(value)] ?? SORT_OPTIONS[0];
      setFilters((current) => ({
        ...current,
        sortBy: option.sortBy,
        sortDir: option.sortDir,
      }));
      return;
    }

    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const applySummaryFilter = (card) => {
    setFilters((current) => ({
      ...current,
      status: card.status ?? "",
    }));
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages || page === pagination.page) {
      return;
    }

    loadQuotations(page);
  };

  const confirmDeleteQuotation = async () => {
    if (!deleteTarget || !companyId) return;

    setIsDeleting(true);

    try {
      const response = await deleteQuotation(deleteTarget.publicId, { companyId });
      showSuccess(response.message || "Quotation deleted successfully");
      setDeleteTarget(null);
      const nextPage =
        quotations.length === 1 && pagination.page > 1
          ? pagination.page - 1
          : pagination.page;
      loadQuotations(nextPage);
    } catch (requestError) {
      showError(
        requestError.response?.data?.message ||
          "Unable to delete quotation right now",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const pageNumbers = useMemo(() => {
    const total = pagination.totalPages;
    const start = Math.max(1, Math.min(pagination.page - 1, total - 3));
    const end = Math.min(total, start + 3);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [pagination.page, pagination.totalPages]);

  const selectedSortIndex = SORT_OPTIONS.findIndex(
    (option) =>
      option.sortBy === filters.sortBy && option.sortDir === filters.sortDir,
  );
  const firstVisible =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const lastVisible = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="quotations-list-page">
      <header className="quotation-list-subheader">
        <div className="quotation-list-title-wrap">
          <h2>Quotations</h2>
          <span>{summary.allOpen} open</span>
        </div>
        <div className="quotation-list-actions">
          <button
            type="button"
            className="lead-button lead-button-secondary"
            onClick={() => showPendingAction("Quotation Performance")}
          >
            <i className="bi bi-graph-up" aria-hidden="true"></i>
            Performance
          </button>
          <Link
            to="/dashboard/quotations/new"
            className="lead-button lead-button-primary"
          >
            <i className="bi bi-plus-lg" aria-hidden="true"></i>
            New Quotation
          </Link>
        </div>
      </header>

      <section className="quotation-stat-grid" aria-label="Quotation summaries">
        {SUMMARY_CARDS.map((card) => {
          const isActive = card.status
            ? filters.status === card.status
            : !filters.status && card.key === "allOpen";
          const value = card.isMoney
            ? formatQuotationMoney(summary[card.key], "USD")
            : summary[card.key] ?? 0;

          return (
            <button
              type="button"
              key={card.key}
              className={`quotation-stat-card ${card.tone} ${isActive ? "active" : ""}`}
              onClick={() => applySummaryFilter(card)}
            >
              <span className="quotation-stat-icon">
                <i className={`bi ${card.icon}`} aria-hidden="true"></i>
              </span>
              <span>
                <strong>{value}</strong>
                {card.label}
              </span>
            </button>
          );
        })}
      </section>

      <section className="quotation-filter-card">
        <div className="quotation-filter-bar">
          <div className="leads-search-field">
            <i className="bi bi-search" aria-hidden="true"></i>
            <input
              type="search"
              placeholder="Search quotation, client, chemical..."
              value={filters.search}
              onChange={updateFilter("search")}
            />
          </div>
          <select value={filters.chemical} onChange={updateFilter("chemical")}>
            <option value="">All Chemicals</option>
            {filterOptions.chemicals.map((chemical) => (
              <option key={chemical} value={chemical}>
                {chemical}
              </option>
            ))}
          </select>
          <select value={filters.status} onChange={updateFilter("status")}>
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select value={filters.owner} onChange={updateFilter("owner")}>
            <option value="">All Owners</option>
            {filterOptions.owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
          <select
            value={selectedSortIndex >= 0 ? selectedSortIndex : 0}
            onChange={updateFilter("sort")}
          >
            {SORT_OPTIONS.map((option, index) => (
              <option key={option.label} value={index}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <p className="leads-filter-count">
          Showing <strong>{firstVisible}-{lastVisible}</strong> of {pagination.total} quotations
        </p>
      </section>

      {error ? <div className="lead-list-state lead-list-error">{error}</div> : null}

      <section className="quotation-table-card">
        <div className="dashboard-table-wrap quotation-table-wrap">
          <table className="dashboard-table quotation-list-table">
            <thead>
              <tr>
                <th className="quotation-check-col">
                  <input type="checkbox" aria-label="Select all quotations" />
                </th>
                <th>Quotation ID</th>
                <th>Client / Country</th>
                <th>Chemical</th>
                <th>Qty & Value</th>
                <th>Margin</th>
                <th>Status</th>
                <th>Expiry</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <tr key={`quotation-skeleton-${index}`}>
                      <td colSpan="10">
                        <div className="lead-table-skeleton"></div>
                      </td>
                    </tr>
                  ))
                : quotations.map((quotation) => {
                    const detailPath = `/dashboard/quotations/${quotation.publicId}`;
                    const expiry = getExpiryMeta(quotation);
                    const marginTone = getMarginTone(quotation.marginPercent);

                    return (
                      <tr
                        key={quotation.publicId}
                        className="quotation-table-row"
                        onClick={() => navigate(detailPath)}
                      >
                        <td
                          className="quotation-check-col"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            aria-label={`Select ${quotation.quotationNumber}`}
                          />
                        </td>
                        <td>
                          <Link
                            to={detailPath}
                            className="quotation-number-cell"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {quotation.quotationNumber}
                          </Link>
                          <span className="quotation-muted">
                            {formatQuotationDate(quotation.quotationDate)}
                          </span>
                        </td>
                        <td>
                          <strong className="quotation-client">
                            {quotation.companyName || quotation.clientName}
                          </strong>
                          <span className="quotation-muted">
                            {quotation.country || "-"}
                          </span>
                        </td>
                        <td>
                          <strong className="quotation-chemical">
                            {quotation.primaryChemical || "-"}
                          </strong>
                          <span className="quotation-muted">
                            {[quotation.primaryGrade, quotation.itemCount > 1 ? `+${quotation.itemCount - 1}` : ""]
                              .filter(Boolean)
                              .join(" ")}
                          </span>
                        </td>
                        <td>
                          <strong className="quotation-money">
                            {formatQuotationMoney(
                              quotation.grandTotal,
                              quotation.currency,
                            )}
                          </strong>
                          <span className="quotation-muted">
                            {quotation.primaryQuantity
                              ? `${quotation.primaryQuantity} ${quotation.primaryUnit || ""}`.trim()
                              : ""}
                            {quotation.incoterm ? ` - ${quotation.incoterm}` : ""}
                          </span>
                        </td>
                        <td>
                          <span className={`quotation-margin ${marginTone}`}>
                            {formatQuotationPercent(quotation.marginPercent)}
                          </span>
                        </td>
                        <td>
                          <span className={`quotation-status ${quotation.status?.toLowerCase()}`}>
                            <i
                              className={`bi ${statusIconMap[quotation.status] || "bi-circle"}`}
                              aria-hidden="true"
                            ></i>
                            {quotation.status}
                          </span>
                        </td>
                        <td>
                          <span className={`quotation-expiry ${expiry.tone}`}>
                            {expiry.icon ? (
                              <i className={`bi ${expiry.icon}`} aria-hidden="true"></i>
                            ) : null}
                            {expiry.label}
                          </span>
                        </td>
                        <td>
                          <span className="quotation-owner">
                            {quotation.createdBy || "Sales Team"}
                          </span>
                        </td>
                        <td onClick={(event) => event.stopPropagation()}>
                          <div className="quotation-row-actions">
                            <Link to={detailPath} title="View quotation" aria-label="View quotation">
                              <i className="bi bi-eye" aria-hidden="true"></i>
                            </Link>
                            <Link
                              to={`${detailPath}/revise`}
                              title="Create revision"
                              aria-label="Create revision"
                            >
                              <i className="bi bi-pencil-square" aria-hidden="true"></i>
                            </Link>
                            <button
                              type="button"
                              title="Send or resend"
                              aria-label="Send or resend quotation"
                              onClick={() => showPendingAction("Send Quotation")}
                            >
                              <i className="bi bi-send" aria-hidden="true"></i>
                            </button>
                            <Link
                              to={`${detailPath}/preview`}
                              title="Preview PDF"
                              aria-label="Preview PDF"
                            >
                              <i className="bi bi-filetype-pdf" aria-hidden="true"></i>
                            </Link>
                            <button
                              type="button"
                              className="danger"
                              title="Delete quotation"
                              aria-label="Delete quotation"
                              onClick={() => setDeleteTarget(quotation)}
                            >
                              <i className="bi bi-trash3" aria-hidden="true"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {!isLoading && quotations.length === 0 && !error ? (
          <div className="lead-list-state lead-list-empty">
            <i className="bi bi-file-earmark-text" aria-hidden="true"></i>
            <strong>No quotations found</strong>
            <span>Create a quotation or adjust the current filters.</span>
            <Link
              to="/dashboard/quotations/new"
              className="lead-button lead-button-primary"
            >
              <i className="bi bi-plus-lg" aria-hidden="true"></i>
              New Quotation
            </Link>
          </div>
        ) : null}
      </section>

      <footer className="leads-pagination quotation-pagination">
        <div className="leads-pagination-summary">
          <span>
            Showing {firstVisible}-{lastVisible} of {pagination.total} quotations
          </span>
          <strong>{formatQuotationMoney(summary.openValue, "USD")} open value</strong>
        </div>
        <div className="leads-pagination-controls">
          <button
            type="button"
            className="lead-page-button lead-page-button-wide"
            disabled={!pagination.hasPrevPage || isLoading}
            onClick={() => goToPage(pagination.page - 1)}
          >
            <i className="bi bi-chevron-left" aria-hidden="true"></i>
            Previous
          </button>
          {pageNumbers.map((page) => (
            <button
              type="button"
              key={page}
              className={`lead-page-button ${page === pagination.page ? "active" : ""}`}
              disabled={isLoading}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            className="lead-page-button lead-page-button-wide"
            disabled={!pagination.hasNextPage || isLoading}
            onClick={() => goToPage(pagination.page + 1)}
          >
            Next
            <i className="bi bi-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
      </footer>

      {deleteTarget ? (
        <div className="lead-confirm-shell" role="presentation">
          <button
            type="button"
            className="lead-confirm-backdrop"
            aria-label="Cancel delete"
            onClick={() => (!isDeleting ? setDeleteTarget(null) : undefined)}
          ></button>
          <section
            className="lead-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-quotation-title"
          >
            <div className="lead-confirm-icon">
              <i className="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
            </div>
            <div>
              <h3 id="delete-quotation-title">Delete quotation?</h3>
              <p>This will remove the quotation from active records.</p>
              <strong>{deleteTarget.quotationNumber}</strong>
            </div>
            <div className="lead-confirm-actions">
              <button
                type="button"
                className="lead-button lead-button-secondary"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="lead-button lead-button-danger"
                disabled={isDeleting}
                onClick={confirmDeleteQuotation}
              >
                {isDeleting ? (
                  <span className="lead-button-spinner" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-trash3" aria-hidden="true"></i>
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
};

export default QuotationsPage;
