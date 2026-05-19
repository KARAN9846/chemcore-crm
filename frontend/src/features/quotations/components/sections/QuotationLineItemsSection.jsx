import {
  formatQuotationMoney,
} from "../../utils/quotationCalculations";
import QuotationLineItemRow from "../lineItems/QuotationLineItemRow";
import QuotationSection from "../common/QuotationSection";

const QuotationLineItemsSection = ({
  charges,
  chargeErrors = {},
  currency,
  errors = {},
  lineItems,
  onAddLine,
  onChargeBlur,
  onChargeChange,
  onDuplicateLine,
  onLineBlur,
  onRemoveLine,
  onUpdateLine,
  totals,
}) => (
  <QuotationSection icon="bi-list-ul" title="Line Items">
    <div className="quotation-line-table-wrap">
      <table className="quotation-line-table">
        <thead>
          <tr>
            <th>Chemical</th>
            <th>Grade / Spec</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Unit Price</th>
            <th>Supplier Cost</th>
            <th>Freight</th>
            <th>Total / Margin</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, index) => (
            <QuotationLineItemRow
              key={item.id}
              currency={currency}
              errors={errors[index]}
              item={item}
              removable={lineItems.length > 1}
              onDuplicate={onDuplicateLine}
              onFieldBlur={onLineBlur}
              onRemove={onRemoveLine}
              onUpdate={onUpdateLine}
            />
          ))}
        </tbody>
      </table>
    </div>

    <button type="button" className="quotation-add-line" onClick={onAddLine}>
      <i className="bi bi-plus-circle" aria-hidden="true"></i>
      Add Line Item
    </button>

    <div className="quotation-totals">
      <div className="quotation-total-row">
        <span>Subtotal (Ex-Works)</span>
        <strong>{formatQuotationMoney(totals.subtotal, currency)}</strong>
      </div>
      <div className="quotation-total-row">
        <span>Total Quantity</span>
        <strong>{totals.totalQuantity.toLocaleString("en-US")}</strong>
      </div>
      <div className="quotation-total-row editable">
        <span>Freight / Logistics</span>
        <input
          type="number"
          className={`quotation-line-input ${
            chargeErrors.freight ? "quotation-line-input-invalid" : ""
          }`}
          value={charges.freight}
          onBlur={() => onChargeBlur("freight")}
          onChange={(event) => onChargeChange("freight", event.target.value)}
        />
      </div>
      <div className="quotation-total-row editable">
        <span>Other Charges</span>
        <input
          type="number"
          className={`quotation-line-input ${
            chargeErrors.otherCharges ? "quotation-line-input-invalid" : ""
          }`}
          value={charges.otherCharges}
          onBlur={() => onChargeBlur("otherCharges")}
          onChange={(event) =>
            onChargeChange("otherCharges", event.target.value)
          }
        />
      </div>
      {chargeErrors.otherCharges ? (
        <div className="lead-field-error">{chargeErrors.otherCharges}</div>
      ) : null}
      <div className="quotation-total-row editable">
        <span>
          Discount
          <select
            className="quotation-line-input quotation-discount-type"
            value={charges.discountType}
            onBlur={() => onChargeBlur("discountType")}
            onChange={(event) =>
              onChargeChange("discountType", event.target.value)
            }
          >
            <option value="pct">%</option>
            <option value="flat">{currency}</option>
          </select>
        </span>
        <input
          type="number"
          className={`quotation-line-input ${
            chargeErrors.discount ? "quotation-line-input-invalid" : ""
          }`}
          value={charges.discount}
          onBlur={() => onChargeBlur("discount")}
          onChange={(event) => onChargeChange("discount", event.target.value)}
        />
      </div>
      {chargeErrors.discount ? (
        <div className="lead-field-error">{chargeErrors.discount}</div>
      ) : null}
      <div className="quotation-total-grand">
        <span>Total Quotation Value</span>
        <strong>{formatQuotationMoney(totals.grandTotal, currency)}</strong>
      </div>
    </div>
  </QuotationSection>
);

export default QuotationLineItemsSection;
