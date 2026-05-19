import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getLeads } from "../../api/leads.api";
import DashboardPanel from "../../components/dashboard/common/DashboardPanel";
import StatusBadge from "../../components/dashboard/common/StatusBadge";
import {
  formatLeadDate,
  formatLeadValue,
  getScoreVariant,
  getStatusVariant,
} from "../../features/leads/utils/leadDisplayUtils";
import { getCompanyId } from "../../utils/company";

const LeadsPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sortBy: "createdAt",
    sortDir: "desc",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeads = useCallback(async (page = 1) => {
    const companyId = getCompanyId();

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
        limit: pagination.limit,
        search: filters.search || undefined,
        status: filters.status || undefined,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
      });

      setLeads(response.data ?? []);
      setPagination(response.pagination);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load leads right now",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.limit]);

  useEffect(() => {
    loadLeads(1);
  }, [loadLeads]);

  const updateFilter = (field) => (event) => {
    setFilters((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  return (
    <div className="leads-workspace">
      <DashboardPanel
        title="Leads"
        titleIcon="bi-funnel-fill"
        actionText="Add Lead"
        actionLink="/dashboard/leads/new"
      >
        <div className="leads-filter-bar">
          <div className="leads-search-field">
            <i className="bi bi-search" aria-hidden="true"></i>
            <input
              type="search"
              placeholder="Search company, contact, email, chemical"
              value={filters.search}
              onChange={updateFilter("search")}
            />
          </div>
          <select value={filters.status} onChange={updateFilter("status")}>
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="quoted">Quoted</option>
            <option value="negotiating">Negotiating</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          <select value={filters.sortBy} onChange={updateFilter("sortBy")}>
            <option value="createdAt">Newest</option>
            <option value="companyName">Company</option>
            <option value="score">Score</option>
            <option value="followUp">Follow-up</option>
            <option value="value">Value</option>
          </select>
        </div>

        {error ? (
          <div className="lead-list-state lead-list-error">{error}</div>
        ) : null}

        <div className="dashboard-table-wrap leads-table-wrap">
          <table className="dashboard-table leads-table">
            <thead>
              <tr>
                <th>Lead ID</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Chemicals</th>
                <th>Value</th>
                <th>Score</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Follow-up</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`lead-skeleton-${index}`}>
                      <td colSpan="10">
                        <div className="lead-table-skeleton"></div>
                      </td>
                    </tr>
                  ))
                : leads.map((lead) => (
                    <tr
                      key={lead.publicId}
                      className="leads-table-row"
                      onClick={() => navigate(`/dashboard/leads/${lead.publicId}`)}
                    >
                      <td>
                        <Link to={`/dashboard/leads/${lead.publicId}`}>
                          {lead.publicId.slice(0, 8)}
                        </Link>
                      </td>
                      <td>
                        <strong>{lead.companyName}</strong>
                        <span>{lead.country}</span>
                      </td>
                      <td>
                        <strong>{lead.contactName || "-"}</strong>
                        <span>{lead.email}</span>
                      </td>
                      <td>{lead.chemicals?.join(", ") || "-"}</td>
                      <td>{formatLeadValue(lead.estimatedValue, lead.currency)}</td>
                      <td>
                        <StatusBadge
                          label={`${lead.leadScore} ${lead.scoreLabel}`}
                          variant={getScoreVariant(lead.scoreLabel)}
                        />
                      </td>
                      <td>{lead.assignedTo || "-"}</td>
                      <td>
                        <StatusBadge
                          label={lead.status}
                          variant={getStatusVariant(lead.status)}
                        />
                      </td>
                      <td>{formatLeadDate(lead.followupDate)}</td>
                      <td>{formatLeadDate(lead.createdAt)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!isLoading && leads.length === 0 && !error ? (
          <div className="lead-list-state">
            <strong>No leads found</strong>
            <span>Create your first lead or adjust the current filters.</span>
          </div>
        ) : null}

        <div className="leads-pagination">
          <span>
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} leads
          </span>
          <div>
            <button
              type="button"
              className="lead-button lead-button-secondary"
              disabled={pagination.page <= 1 || isLoading}
              onClick={() => loadLeads(pagination.page - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="lead-button lead-button-secondary"
              disabled={pagination.page >= pagination.totalPages || isLoading}
              onClick={() => loadLeads(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </DashboardPanel>
    </div>
  );
};

export default LeadsPage;
