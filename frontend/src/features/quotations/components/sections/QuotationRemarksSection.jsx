import QuotationSection from "../common/QuotationSection";

const QuotationRemarksSection = ({ data, onInputChange }) => (
  <QuotationSection icon="bi-chat-square-text-fill" title="Remarks & Terms">
    <div className="row g-3">
      <div className="col-12">
        <label className="lead-form-label" htmlFor="quotation-client-remarks">
          Remarks for Client
        </label>
        <textarea
          id="quotation-client-remarks"
          className="lead-form-control lead-textarea"
          rows="3"
          placeholder="Any special conditions, remarks or notes for the client that will appear on the quotation PDF..."
          value={data.clientRemarks}
          onChange={(event) => onInputChange("clientRemarks", event.target.value)}
        />
      </div>
      <div className="col-12">
        <label className="lead-form-label" htmlFor="quotation-internal-notes">
          Internal Notes <span className="lead-label-muted">(not shown to client)</span>
        </label>
        <textarea
          id="quotation-internal-notes"
          className="lead-form-control lead-textarea"
          rows="2"
          placeholder="Notes for your team - price buffer, special instructions, context from negotiations..."
          value={data.internalNotes}
          onChange={(event) => onInputChange("internalNotes", event.target.value)}
        />
      </div>
    </div>
  </QuotationSection>
);

export default QuotationRemarksSection;
