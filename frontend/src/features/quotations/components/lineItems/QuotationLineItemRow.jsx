import { quotationChemicals } from "../../constants/quotationDefaults";
import {
  formatQuotationMoney,
  formatQuotationPercent,
} from "../../utils/quotationCalculations";

const units = ["MT", "KG", "L"];

const QuotationLineItemRow = ({
  currency,
  errors = {},
  index,
  item,
  onDuplicate,
  onFieldBlur,
  onRemove,
  onUpdate,
  removable,
}) => {
  const inputClass = (field, extra = "") =>
    `quotation-line-input ${extra} ${
      errors[field] ? "quotation-line-input-invalid" : ""
    }`;

  return (
    <tr className={Object.keys(errors).length ? "quotation-line-row-invalid" : ""}>
    <td>
      <span className="quotation-line-index">{index + 1}</span>
    </td>
    <td>
      <select
        className={inputClass("chemical")}
        value={item.chemical}
        onBlur={() => onFieldBlur(item.id, "chemical")}
        onChange={(event) => onUpdate(item.id, "chemical", event.target.value)}
      >
        <option value="">Select chemical...</option>
        {quotationChemicals.map((chemical) => (
          <option key={chemical} value={chemical}>{chemical}</option>
        ))}
      </select>
      {errors.chemical ? (
        <div className="quotation-line-error">{errors.chemical}</div>
      ) : null}
    </td>
    <td>
      <input
        className={inputClass("grade")}
        placeholder="Grade/Spec"
        value={item.grade}
        onBlur={() => onFieldBlur(item.id, "grade")}
        onChange={(event) => onUpdate(item.id, "grade", event.target.value)}
      />
    </td>
    <td>
      <input
        type="number"
        min="0"
        className={inputClass("quantity")}
        value={item.quantity}
        onBlur={() => onFieldBlur(item.id, "quantity")}
        onChange={(event) => onUpdate(item.id, "quantity", event.target.value)}
      />
      {errors.quantity ? (
        <div className="quotation-line-error">{errors.quantity}</div>
      ) : null}
    </td>
    <td>
      <select
        className={inputClass("unit")}
        value={item.unit}
        onBlur={() => onFieldBlur(item.id, "unit")}
        onChange={(event) => onUpdate(item.id, "unit", event.target.value)}
      >
        {units.map((unit) => (
          <option key={unit} value={unit}>{unit}</option>
        ))}
      </select>
      {errors.unit ? (
        <div className="quotation-line-error">{errors.unit}</div>
      ) : null}
    </td>
    <td>
      <input
        type="number"
        min="0"
        className={inputClass("unitPrice")}
        value={item.unitPrice}
        onBlur={() => onFieldBlur(item.id, "unitPrice")}
        onChange={(event) => onUpdate(item.id, "unitPrice", event.target.value)}
      />
      {errors.unitPrice ? (
        <div className="quotation-line-error">{errors.unitPrice}</div>
      ) : null}
    </td>
    <td>
      <input
        type="number"
        min="0"
        className={inputClass("supplierCost", "quotation-cost-input")}
        value={item.supplierCost}
        onBlur={() => onFieldBlur(item.id, "supplierCost")}
        onChange={(event) => onUpdate(item.id, "supplierCost", event.target.value)}
      />
      {errors.supplierCost ? (
        <div className="quotation-line-error">{errors.supplierCost}</div>
      ) : null}
    </td>
    <td>
      <input
        type="number"
        min="0"
        className={inputClass("freight", "quotation-cost-input")}
        value={item.freight}
        onBlur={() => onFieldBlur(item.id, "freight")}
        onChange={(event) => onUpdate(item.id, "freight", event.target.value)}
      />
      {errors.freight ? (
        <div className="quotation-line-error">{errors.freight}</div>
      ) : null}
    </td>
    <td>
      <span className="quotation-line-total">
        {formatQuotationMoney(item.lineTotal, currency)}
      </span>
      <span
        className={`quotation-line-margin ${
          item.marginPercent < 0
            ? "loss"
            : item.marginPercent < 8
              ? "low"
              : item.marginPercent >= 15
                ? "healthy"
                : ""
        }`}
      >
        {formatQuotationPercent(item.marginPercent)}
      </span>
    </td>
    <td>
      <div className="quotation-row-actions">
        <button
          type="button"
          className="quotation-row-delete"
          aria-label="Duplicate line item"
          onClick={() => onDuplicate(item.id)}
        >
          <i className="bi bi-files" aria-hidden="true"></i>
        </button>
        <button
          type="button"
          className="quotation-row-delete"
          disabled={!removable}
          aria-label="Remove line item"
          onClick={() => onRemove(item.id)}
        >
          <i className="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </div>
    </td>
    </tr>
  );
};

export default QuotationLineItemRow;
