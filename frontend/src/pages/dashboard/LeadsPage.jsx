import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { deleteLead, getLeads } from "../../api/leads.api";
import StatusBadge from "../../components/dashboard/common/StatusBadge";
import LeadActivityDrawer from "../../features/leads/components/activity/LeadActivityDrawer";
import { getLeadActivities } from "../../features/leads/api/leadActivities.api";
import {
  formatLeadDate,
  formatLeadValue,
  getScoreVariant,
  getStatusVariant,
} from "../../features/leads/utils/leadDisplayUtils";
import { getCompanyId } from "../../utils/company";
import { showError, showSuccess } from "../../utils/toast";

const STATUS_FILTERS = [
  { label: "New Inquiry", value: "new" },
  { label: "Qualified", value: "qualified" },
  { label: "Quoted", value: "quoted" },
  { label: "Negotiating", value: "negotiating" },
  { label: "Converted", value: "converted" },
  { label: "Lost", value: "lost" },
];

const SUMMARY_CARDS = [
  { key: "all", label: "All Leads", icon: "bi-collection", tone: "all" },
  { key: "hot", label: "Hot", icon: "bi-fire", tone: "hot", scoreLabel: "Hot" },
  {
    key: "followupDue",
    label: "Follow-up Due",
    icon: "bi-alarm",
    tone: "due",
  },
  {
    key: "negotiating",
    label: "Negotiating",
    icon: "bi-arrow-left-right",
    tone: "negotiating",
    status: "negotiating",
  },
  {
    key: "converted",
    label: "Converted",
    icon: "bi-check2-circle",
    tone: "converted",
    status: "converted",
  },
  { key: "lost", label: "Lost", icon: "bi-x-circle", tone: "lost", status: "lost" },
];

const AVATAR_COLORS = [
  "#1f7a4d",
  "#365f91",
  "#9f5f21",
  "#7c3f78",
  "#2f6f73",
  "#8f3f52",
  "#5c6b2f",
  "#4f5f7c",
];

const SOURCE_ICONS = {
  website: "bi-globe2",
  referral: "bi-people",
  linkedin: "bi-linkedin",
  direct: "bi-telephone",
  whatsapp: "bi-whatsapp",
  "trade fair": "bi-building",
  "email campaign": "bi-envelope-paper",
};

const LEADS_PAGE_LIMIT = 10;

const normalizeStatusLabel = (value = "") =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ") || "-";

const getInitials = (lead = {}) => {
  const source = lead.contactName || lead.companyName || lead.email || "Lead";

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
};

const getFollowupClass = (value) => {
  if (!value) return "none";

  const today = new Date();
  const followup = new Date(value);
  today.setHours(0, 0, 0, 0);
  followup.setHours(0, 0, 0, 0);

  const dayDiff = Math.ceil((followup - today) / 86400000);

  if (dayDiff <= 0) return "today";
  if (dayDiff <= 2) return "soon";
  return "ok";
};

const getUniqueOptions = (leads, getter) =>
  Array.from(new Set(leads.map(getter).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );

const buildLeadName = (lead = {}) => lead.contactName || lead.companyName || "Lead";

const LeadsPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: LEADS_PAGE_LIMIT,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [summary, setSummary] = useState({
    all: 0,
    hot: 0,
    followupDue: 0,
    negotiating: 0,
    converted: 0,
    lost: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    scoreLabel: "",
    sortBy: "createdAt",
    sortDir: "desc",
    chemical: "",
    country: "",
    source: "",
    owner: "",
    followupDue: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activityLead, setActivityLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isActivityLoading, setIsActivityLoading] = useState(false);

  const companyId = getCompanyId();

  const loadLeads = useCallback(
    async (page = 1) => {
      if (!companyId) {
        setError("Company ID missing. Please complete onboarding first.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await getLeads({
          companyId,
          page,
          limit: LEADS_PAGE_LIMIT,
          search: filters.search || undefined,
          status: filters.status || undefined,
          scoreLabel: filters.scoreLabel || undefined,
          followupDue: filters.followupDue || undefined,
          chemical: filters.chemical || undefined,
          country: filters.country || undefined,
          source: filters.source || undefined,
          owner: filters.owner || undefined,
          sortBy: filters.sortBy,
          sortDir: filters.sortDir,
        });

        setLeads(response.data ?? []);
        setSummary((current) => ({ ...current, ...(response.summary ?? {}) }));
        setPagination({
          page: response.pagination?.page ?? page,
          limit: response.pagination?.limit ?? LEADS_PAGE_LIMIT,
          total: response.pagination?.total ?? 0,
          totalPages: response.pagination?.totalPages ?? 1,
          hasNextPage: Boolean(response.pagination?.hasNextPage),
          hasPrevPage: Boolean(response.pagination?.hasPrevPage),
        });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load leads right now",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      companyId,
      filters.chemical,
      filters.country,
      filters.owner,
      filters.scoreLabel,
      filters.followupDue,
      filters.search,
      filters.sortBy,
      filters.sortDir,
      filters.source,
      filters.status,
    ],
  );

  useEffect(() => {
    loadLeads(1);
  }, [loadLeads]);

  const filterOptions = useMemo(
    () => ({
      chemicals: getUniqueOptions(leads, (lead) => lead.chemicals?.[0]),
      countries: getUniqueOptions(leads, (lead) => lead.country),
      sources: getUniqueOptions(leads, (lead) => lead.source),
      owners: getUniqueOptions(leads, (lead) => lead.assignedTo),
    }),
    [leads],
  );

  const updateFilter = (field) => (event) => {
    setFilters((current) => ({
      ...current,
      [field]: event.target.value,
      ...(field === "status" ? { scoreLabel: "", followupDue: false } : {}),
      ...(field === "scoreLabel" ? { status: "", followupDue: false } : {}),
    }));
  };

  const applySummaryFilter = (card) => {
    setFilters((current) => ({
      ...current,
      status: card.status ?? "",
      scoreLabel: card.scoreLabel ?? "",
      followupDue: card.key === "followupDue",
    }));
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages || page === pagination.page) {
      return;
    }

    loadLeads(page);
  };

  const openActivityDrawer = async (lead) => {
    setActivityLead(lead);
    setActivities([]);

    if (!companyId) {
      showError("Company ID missing. Please complete onboarding first.");
      return;
    }

    setIsActivityLoading(true);

    try {
      const response = await getLeadActivities(lead.publicId, { companyId });
      setActivities(response.data ?? []);
    } catch (requestError) {
      showError(
        requestError.response?.data?.message ||
          "Unable to load recent conversations",
      );
    } finally {
      setIsActivityLoading(false);
    }
  };

  const handleActivityCreated = useCallback(
    (activity, message) => {
      setActivityLead(null);
      setActivities([]);
      showSuccess(message || "Conversation saved successfully");
      loadLeads(pagination.page);
    },
    [loadLeads, pagination.page],
  );

  const confirmDeleteLead = async () => {
    if (!deleteTarget || !companyId) return;

    setIsDeleting(true);

    try {
      const response = await deleteLead(deleteTarget.publicId, { companyId });
      showSuccess(response.message || "Lead deleted successfully");
      setDeleteTarget(null);
      const nextPage =
        leads.length === 1 && pagination.page > 1
          ? pagination.page - 1
          : pagination.page;
      loadLeads(nextPage);
    } catch (requestError) {
      showError(
        requestError.response?.data?.message ||
          "Unable to delete lead right now",
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

  const firstVisible =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const lastVisible = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="leads-workspace leads-list-page">
      <header className="leads-list-subheader">
        <div className="leads-list-title-wrap">
          <h2>Leads</h2>
          <span>{summary.all} active</span>
        </div>
        <div className="leads-list-actions">
          <button
            type="button"
            className="lead-button lead-button-secondary"
            onClick={() => window.alert("Import CSV action is not connected yet.")}
          >
            <i className="bi bi-upload" aria-hidden="true"></i>
            Import CSV
          </button>
          <Link to="/dashboard/leads/new" className="lead-button lead-button-primary">
            <i className="bi bi-plus-lg" aria-hidden="true"></i>
            Add Lead
          </Link>
        </div>
      </header>

      <section className="lead-stat-pills" aria-label="Lead summaries">
        {SUMMARY_CARDS.map((card) => {
          const isActive =
            (card.status && filters.status === card.status) ||
            (card.scoreLabel && filters.scoreLabel === card.scoreLabel) ||
            (card.key === "followupDue" && filters.followupDue) ||
            (card.key === "all" &&
              !filters.status &&
              !filters.scoreLabel &&
              !filters.followupDue);

          return (
            <button
              type="button"
              key={card.key}
              className={`lead-stat-pill ${card.tone} ${isActive ? "active" : ""}`}
              onClick={() => applySummaryFilter(card)}
            >
              <span className="lead-stat-icon">
                <i className={`bi ${card.icon}`} aria-hidden="true"></i>
              </span>
              <span>
                <strong>{summary[card.key] ?? 0}</strong>
                {card.label}
              </span>
            </button>
          );
        })}
      </section>

      <section className="leads-list-filter-card">
        <div className="leads-filter-bar">
          <div className="leads-search-field">
            <i className="bi bi-search" aria-hidden="true"></i>
            <input
              type="search"
              placeholder="Search leads, company, chemical..."
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
          <select value={filters.country} onChange={updateFilter("country")}>
            <option value="">All Countries</option>
            {filterOptions.countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select value={filters.source} onChange={updateFilter("source")}>
            <option value="">All Sources</option>
            {filterOptions.sources.map((source) => (
              <option key={source} value={source}>
                {source}
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
          <select value={filters.status} onChange={updateFilter("status")}>
            <option value="">All Stages</option>
            {STATUS_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          <select value={filters.sortBy} onChange={updateFilter("sortBy")}>
            <option value="createdAt">Newest</option>
            <option value="companyName">Company</option>
            <option value="score">Score</option>
            <option value="followUp">Follow-up</option>
            <option value="value">Value</option>
          </select>
        </div>
        <p className="leads-filter-count">
          Showing <strong>{firstVisible}-{lastVisible}</strong> of {pagination.total} leads
        </p>
      </section>

      {error ? <div className="lead-list-state lead-list-error">{error}</div> : null}

      <section className="leads-table-card">
        <div className="dashboard-table-wrap leads-table-wrap">
          <table className="dashboard-table leads-table">
            <thead>
              <tr>
                <th>Lead / Company</th>
                <th>Chemicals</th>
                <th>Estimated Value</th>
                <th>Score</th>
                <th>Current Stage</th>
                <th>Lead Source</th>
                <th>Follow-up</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <tr key={`lead-skeleton-${index}`}>
                      <td colSpan="9">
                        <div className="lead-table-skeleton"></div>
                      </td>
                    </tr>
                  ))
                : leads.map((lead, index) => {
                    const followupClass = getFollowupClass(lead.followupDate);
                    const detailPath = `/dashboard/leads/${lead.publicId}`;
                    const sourceLabel = lead.source || "Unknown Source";
                    const sourceIcon =
                      SOURCE_ICONS[sourceLabel.toLowerCase()] ||
                      "bi-box-arrow-in-right";

                    return (
                      <tr
                        key={lead.publicId}
                        className="leads-table-row"
                        onClick={() => navigate(detailPath)}
                      >
                        <td>
                          <div className="lead-name-wrap">
                            <span
                              className="lead-list-avatar"
                              style={{
                                background: AVATAR_COLORS[index % AVATAR_COLORS.length],
                              }}
                            >
                              {getInitials(lead)}
                            </span>
                            <span>
                              <Link
                                to={detailPath}
                                onClick={(event) => event.stopPropagation()}
                              >
                                {buildLeadName(lead)}
                              </Link>
                              <small>
                                {lead.companyName}
                                {lead.country ? ` - ${lead.country}` : ""}
                              </small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="lead-table-truncate">
                            {lead.chemicals?.join(", ") || "-"}
                          </span>
                        </td>
                        <td>
                          <strong>{formatLeadValue(lead.estimatedValue, lead.currency)}</strong>
                          <span>
                            {lead.quantityRequired
                              ? `${lead.quantityRequired} ${lead.unit || ""}`.trim()
                              : "Quantity not set"}
                          </span>
                        </td>
                        <td>
                          <StatusBadge
                            label={`${lead.leadScore} ${lead.scoreLabel}`}
                            variant={getScoreVariant(lead.scoreLabel)}
                          />
                        </td>
                        <td>
                          <StatusBadge
                            label={normalizeStatusLabel(lead.currentStage || lead.status)}
                            variant={getStatusVariant(lead.status)}
                          />
                        </td>
                        <td>
                          <span className="lead-source-tag">
                            <i className={`bi ${sourceIcon}`} aria-hidden="true"></i>
                            {sourceLabel}
                          </span>
                        </td>
                        <td>
                          <span className={`lead-followup-chip ${followupClass}`}>
                            {followupClass !== "none" ? (
                              <i className="bi bi-alarm" aria-hidden="true"></i>
                            ) : null}
                            {formatLeadDate(lead.followupDate)}
                          </span>
                        </td>
                        <td>
                          <span className="lead-owner-cell">
                            {lead.assignedTo || "Unassigned"}
                          </span>
                        </td>
                        <td onClick={(event) => event.stopPropagation()}>
                          <div className="lead-row-actions" aria-label="Lead actions">
                            <Link to={detailPath} title="View Lead" aria-label="View lead">
                              <i className="bi bi-eye" aria-hidden="true"></i>
                            </Link>
                            <Link
                              to={`/dashboard/leads/${lead.publicId}/edit`}
                              title="Edit Lead"
                              aria-label="Edit lead"
                            >
                              <i className="bi bi-pencil" aria-hidden="true"></i>
                            </Link>
                            <button
                              type="button"
                              title="Log Conversation"
                              aria-label="Log conversation"
                              onClick={() => openActivityDrawer(lead)}
                            >
                              <i className="bi bi-chat-dots" aria-hidden="true"></i>
                            </button>
                            <Link
                              to={`/dashboard/leads/${lead.publicId}/follow-up`}
                              title="Set Follow-up"
                              aria-label="Set follow-up"
                            >
                              <i className="bi bi-alarm" aria-hidden="true"></i>
                            </Link>
                            <button
                              type="button"
                              className="danger"
                              title="Delete Lead"
                              aria-label="Delete lead"
                              onClick={() => setDeleteTarget(lead)}
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

        {!isLoading && leads.length === 0 && !error ? (
          <div className="lead-list-state lead-list-empty">
            <i className="bi bi-inboxes" aria-hidden="true"></i>
            <strong>No leads found</strong>
            <span>Create your first lead or adjust the current filters.</span>
            <Link to="/dashboard/leads/new" className="lead-button lead-button-primary">
              <i className="bi bi-plus-lg" aria-hidden="true"></i>
              Create your first lead
            </Link>
          </div>
        ) : null}
      </section>

      <footer className="leads-pagination">
        <div className="leads-pagination-summary">
          <span>
            Showing {firstVisible}-{lastVisible} of {pagination.total} leads
          </span>
          <strong>
            Page {pagination.page} of {pagination.totalPages}
          </strong>
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
            aria-labelledby="delete-lead-title"
          >
            <div className="lead-confirm-icon">
              <i className="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
            </div>
            <div>
              <h3 id="delete-lead-title">Delete lead?</h3>
              <p>This will permanently delete this lead and related activities.</p>
              <strong>{buildLeadName(deleteTarget)}</strong>
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
                onClick={confirmDeleteLead}
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

      <LeadActivityDrawer
        activities={isActivityLoading ? [] : activities}
        companyId={companyId}
        isOpen={Boolean(activityLead)}
        lead={activityLead ?? {}}
        onActivityCreated={handleActivityCreated}
        onClose={() => setActivityLead(null)}
      />
    </div>
  );
};

export default LeadsPage;
