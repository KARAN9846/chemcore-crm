import { memo } from "react";

import { formatLeadDate, formatLeadValue } from "../../utils/leadDisplayUtils";

const Value = ({ children, highlight }) => (
  <strong className={highlight ? "lead-info-value-highlight" : ""}>
    {children || "-"}
  </strong>
);

const LeadInfoCard = ({ lead }) => {
  const contactName = [lead.firstName, lead.lastName].filter(Boolean).join(" ");

  return (
    <section className="lead-detail-card">
      <div className="lead-detail-card-header">
        <h3>
          <i className="bi bi-person-lines-fill" aria-hidden="true"></i>
          Lead Information
        </h3>
        <button type="button" className="lead-panel-action">
          <i className="bi bi-pencil" aria-hidden="true"></i>
          Edit
        </button>
      </div>

      <div className="lead-info-sections">
        <div>
          <h4>Contact Details</h4>
          <div className="lead-detail-fields">
            <span>Contact Name</span><Value>{contactName}</Value>
            <span>Designation</span><Value>{lead.designation}</Value>
            <span>Email</span><Value>{lead.email}</Value>
            <span>Phone / WhatsApp</span><Value>{lead.phone}</Value>
            <span>Country</span><Value>{lead.country}</Value>
          </div>
        </div>

        <div>
          <h4>Company Details</h4>
          <div className="lead-detail-fields">
            <span>Company</span><Value>{lead.companyName}</Value>
            <span>City</span><Value>{lead.city}</Value>
            <span>Lead Source</span><Value>{lead.source}</Value>
            <span>Source Detail</span><Value>{lead.sourceDetail}</Value>
            <span>Assigned To</span><Value>{lead.assignedTo}</Value>
          </div>
        </div>

        <div>
          <h4>Chemical Requirement</h4>
          <div className="lead-detail-fields">
            <span>Chemical Interested</span><Value>{lead.chemicals?.join(", ")}</Value>
            <span>Quantity Required</span><Value>{lead.quantityRequired ? `${lead.quantityRequired} ${lead.unit || ""}` : ""}</Value>
            <span>Frequency</span><Value>{lead.frequency}</Value>
            <span>Estimated Value</span><Value highlight>{formatLeadValue(lead.estimatedValue, lead.currency)}</Value>
          </div>
        </div>

        <div>
          <h4>Trade Terms</h4>
          <div className="lead-detail-fields">
            <span>Incoterm Preference</span><Value>{lead.incoterm}</Value>
            <span>Payment Terms</span><Value>{lead.paymentTerms?.join(", ")}</Value>
            <span>Packaging</span><Value>{lead.packagingRequirement}</Value>
            <span>Port of Destination</span><Value>{lead.portOfDestination}</Value>
          </div>
        </div>

        <div>
          <h4>CRM Dates</h4>
          <div className="lead-detail-fields">
            <span>Lead Date</span><Value>{formatLeadDate(lead.createdAt)}</Value>
            <span>Last Updated</span><Value>{formatLeadDate(lead.updatedAt)}</Value>
            <span>Next Follow-up</span><Value>{formatLeadDate(lead.followupDate)}</Value>
            <span>Follow-up Via</span><Value>{lead.followupVia}</Value>
          </div>
        </div>
      </div>

      <div className="lead-notes-panel">
        <span>Notes / Requirements</span>
        <p>{lead.notes || "No notes captured yet."}</p>
      </div>
    </section>
  );
};

export default memo(LeadInfoCard);
