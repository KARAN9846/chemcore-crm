import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getLeadByPublicId,
  updateLeadFollowup,
} from "../../api/leads.api";
import LeadEmptyState from "../../features/leads/components/detail/LeadEmptyState";
import LeadLoadingState from "../../features/leads/components/detail/LeadLoadingState";
import { formatLeadDate } from "../../features/leads/utils/leadDisplayUtils";
import { getLeadInitials } from "../../features/leads/utils/leadStatusUtils";
import { getCompanyId } from "../../utils/company";
import { showError, showSuccess, showValidationWarning } from "../../utils/toast";

const quickDates = [
  { label: "Today", days: 0 },
  { label: "Tomorrow", days: 1 },
  { label: "In 2 days", days: 2 },
  { label: "In 3 days", days: 3 },
  { label: "Next week", days: 7 },
  { label: "In 2 weeks", days: 14 },
];

const channels = [
  { label: "Call", icon: "bi-telephone-fill" },
  { label: "Email", icon: "bi-envelope-fill" },
  { label: "WhatsApp", icon: "bi-whatsapp" },
  { label: "Meeting", icon: "bi-people-fill" },
  { label: "Send Quotation", icon: "bi-file-earmark-text-fill" },
  { label: "Other", icon: "bi-pin-angle-fill" },
];

const priorities = [
  { label: "High", value: "high", icon: "bi-record-circle-fill" },
  { label: "Medium", value: "medium", icon: "bi-circle-fill" },
  { label: "Low", value: "low", icon: "bi-circle" },
];

const toDateInput = (date) => date.toISOString().split("T")[0];

const getDateAhead = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateInput(date);
};

const getDefaultDate = (lead) => lead?.followupDate || getDateAhead(2);

const LeadFollowupPage = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedQuickDate, setSelectedQuickDate] = useState(2);
  const [form, setForm] = useState({
    date: getDateAhead(2),
    time: "10:00",
    channel: "Call",
    priority: "high",
    note: "",
    notifyWho: "me",
    notifyVia: "In-app",
  });

  useEffect(() => {
    let isMounted = true;

    const loadLead = async () => {
      const companyId = getCompanyId();

      if (!companyId) {
        setError("Company ID missing. Please complete onboarding first.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getLeadByPublicId(publicId, { companyId });

        if (!isMounted) {
          return;
        }

        setLead(response.data);
        setForm((current) => ({
          ...current,
          date: getDefaultDate(response.data),
          time: response.data.followupTime || current.time,
          channel: response.data.followupVia || current.channel,
          note: response.data.notes || "",
          notifyWho: response.data.assignedTo || "me",
        }));
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load lead follow-up right now",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLead();

    return () => {
      isMounted = false;
    };
  }, [publicId]);

  const contactName = useMemo(
    () => [lead?.firstName, lead?.lastName].filter(Boolean).join(" "),
    [lead],
  );

  const upcomingReminders = useMemo(
    () => [
      {
        id: "current",
        priority: form.priority,
        title: `${form.channel} - ${form.note || "Follow up with buyer"}`,
        subtitle: form.note || "Confirm next commercial step",
        time: `${formatLeadDate(form.date)} ${form.time || ""}`.trim(),
      },
      {
        id: "quotation",
        priority: "medium",
        title: "Send revised quotation",
        subtitle: "If buyer confirms requirements, prepare quotation",
        time: "Next action",
      },
      {
        id: "docs",
        priority: "low",
        title: "Share compliance documents",
        subtitle: "COA / MSDS / Certificate of Origin if requested",
        time: "After quote",
      },
    ],
    [form],
  );

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleQuickDate = (quickDate) => {
    setSelectedQuickDate(quickDate.days);
    setForm((current) => ({
      ...current,
      date: getDateAhead(quickDate.days),
    }));
  };

  const handleSave = async () => {
    if (!form.date) {
      showValidationWarning("Follow-up date is required");
      return;
    }

    const companyId = getCompanyId();

    if (!companyId) {
      showError("Company ID missing. Please complete onboarding first.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await updateLeadFollowup(publicId, {
        companyId,
        followup: {
          date: form.date,
          time: form.time,
          via: form.channel,
          note: form.note,
        },
      });

      showSuccess(response.message || "Follow-up updated successfully");
      navigate(`/dashboard/leads/${publicId}`, {
        replace: true,
        state: { createdLead: response.data },
      });
    } catch (requestError) {
      showError(
        requestError.response?.data?.message ||
          "Unable to update follow-up right now",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LeadLoadingState />;
  }

  if (error || !lead) {
    return <LeadEmptyState message={error || "Lead not found"} />;
  }

  return (
    <div className="lead-followup-page">
      <button
        type="button"
        className="lead-followup-backdrop"
        aria-label="Back to lead detail"
        onClick={() => navigate(`/dashboard/leads/${publicId}`)}
      ></button>

      <section className="lead-followup-drawer" aria-label="Set follow-up reminder">
        <header className="lead-followup-drawer-header">
          <div>
            <h2>
              <i className="bi bi-alarm-fill" aria-hidden="true"></i>
              Set Follow-up Reminder
            </h2>
            <div className="lead-followup-lead-info">
              <div className="lead-detail-avatar">{getLeadInitials(lead)}</div>
              <div>
                <strong>{contactName || lead.companyName}</strong>
                <span>
                  {lead.companyName} - {lead.country || "No country"} -{" "}
                  {lead.scoreLabel}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="lead-followup-close"
            onClick={() => navigate(`/dashboard/leads/${publicId}`)}
          >
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </header>

        <div className="lead-followup-drawer-body">
          <section className="lead-current-followup">
            <span>
              <i className="bi bi-alarm-fill" aria-hidden="true"></i>
              Current Follow-up
            </span>
            <strong>
              {lead.followupVia || "Follow-up"} - {formatLeadDate(lead.followupDate)}
              {lead.followupTime ? `, ${lead.followupTime}` : ""}
            </strong>
            <p>{lead.notes || "No current follow-up note captured."}</p>
          </section>

          <form className="lead-followup-form" noValidate>
            <label className="lead-form-label">
              Quick Select Date <span className="req">*</span>
            </label>
            <div className="lead-followup-quick-dates">
              {quickDates.map((quickDate) => (
                <button
                  key={quickDate.label}
                  type="button"
                  className={`lead-choice-pill ${
                    selectedQuickDate === quickDate.days ? "selected" : ""
                  }`}
                  onClick={() => handleQuickDate(quickDate)}
                >
                  {quickDate.label}
                </button>
              ))}
            </div>

            <div className="lead-followup-form-grid">
              <div>
                <label className="lead-form-label" htmlFor="followup-date">
                  Date <span className="req">*</span>
                </label>
                <input
                  id="followup-date"
                  type="date"
                  className="lead-form-control"
                  value={form.date}
                  onChange={updateField("date")}
                />
              </div>
              <div>
                <label className="lead-form-label" htmlFor="followup-time">
                  Time
                </label>
                <input
                  id="followup-time"
                  type="time"
                  className="lead-form-control"
                  value={form.time}
                  onChange={updateField("time")}
                />
              </div>
            </div>

            <div className="lead-followup-divider">How to follow up</div>

            <label className="lead-form-label">
              Follow-up Channel <span className="req">*</span>
            </label>
            <div className="lead-followup-channel-grid">
              {channels.map((channel) => (
                <button
                  key={channel.label}
                  type="button"
                  className={`lead-followup-card-button ${
                    form.channel === channel.label ? "selected" : ""
                  }`}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      channel: channel.label,
                    }))
                  }
                >
                  <i className={`bi ${channel.icon}`} aria-hidden="true"></i>
                  <span>{channel.label}</span>
                </button>
              ))}
            </div>

            <label className="lead-form-label">Priority</label>
            <div className="lead-followup-priority-pills">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  className={`lead-followup-priority ${priority.value} ${
                    form.priority === priority.value ? "selected" : ""
                  }`}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      priority: priority.value,
                    }))
                  }
                >
                  <i className={`bi ${priority.icon}`} aria-hidden="true"></i>
                  {priority.label}
                </button>
              ))}
            </div>

            <div>
              <label className="lead-form-label" htmlFor="followup-note">
                Reminder Note
              </label>
              <textarea
                id="followup-note"
                className="lead-form-control lead-textarea"
                rows="3"
                placeholder="e.g. Check if they accepted revised pricing. Ask about delivery port preference."
                value={form.note}
                onChange={updateField("note")}
              ></textarea>
              <div className="lead-form-hint">
                This note appears when the reminder triggers on your dashboard.
              </div>
            </div>

            <div>
              <label className="lead-form-label">Notify</label>
              <div className="lead-followup-form-grid notify">
                <select
                  className="lead-form-control"
                  value={form.notifyWho}
                  onChange={updateField("notifyWho")}
                >
                  <option value="me">Myself</option>
                  {lead.assignedTo ? (
                    <option value={lead.assignedTo}>{lead.assignedTo}</option>
                  ) : null}
                  <option value="All Sales Team">All Sales Team</option>
                </select>
                <select
                  className="lead-form-control"
                  value={form.notifyVia}
                  onChange={updateField("notifyVia")}
                >
                  <option>In-app</option>
                  <option>Email + In-app</option>
                  <option>SMS + In-app</option>
                </select>
              </div>
            </div>

            <div className="lead-followup-divider">
              Upcoming Reminders for this Lead
            </div>

            <div className="lead-upcoming-list">
              {upcomingReminders.map((item) => (
                <div key={item.id} className="lead-upcoming-item">
                  <span className={`lead-upcoming-dot ${item.priority}`}></span>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.subtitle}</span>
                  </div>
                  <em>{item.time}</em>
                  <button type="button">Done</button>
                </div>
              ))}
            </div>
          </form>
        </div>

        <footer className="lead-followup-drawer-footer">
          <button
            type="button"
            className="lead-button lead-button-secondary"
            onClick={() => navigate(`/dashboard/leads/${publicId}`)}
          >
            <i className="bi bi-x-lg" aria-hidden="true"></i>
            Cancel
          </button>
          <button
            type="button"
            className="lead-button lead-button-primary"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? (
              <span className="lead-button-spinner" aria-hidden="true"></span>
            ) : (
              <i className="bi bi-alarm-fill" aria-hidden="true"></i>
            )}
            {isSaving ? "Saving..." : "Set Reminder"}
          </button>
        </footer>
      </section>
    </div>
  );
};

export default LeadFollowupPage;
