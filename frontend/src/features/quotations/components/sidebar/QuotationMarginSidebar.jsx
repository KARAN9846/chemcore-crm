import { formatQuotationMoney } from "../../utils/quotationCalculations";
import {
  getMarginHealthLabel,
  getMarginHealthTitle,
  getQuotationMarginSnapshot,
} from "../../utils/quotationMarginUtils";

const QuotationMarginSidebar = ({ totals }) => {
  const margin = getQuotationMarginSnapshot(totals);
  const progress = Math.min(Math.max(margin.marginPercent, 0), 50) * 2;

  return (
    <aside className="quotation-margin-sidebar">
      <section className="quotation-margin-card">
        <header>
          <h3>
            <i className="bi bi-calculator-fill" aria-hidden="true"></i>
            Live Margin Calculator
          </h3>
        </header>

        <div className="quotation-margin-display">
          <strong>{margin.marginPercent.toFixed(1)}%</strong>
          <span>Gross Margin</span>
          <p>
            Profit:{" "}
            <b>{formatQuotationMoney(margin.grossProfit, totals.currency)}</b>
          </p>
        </div>

        <div className="quotation-margin-meter">
          <span
            className={`quotation-margin-meter-fill ${margin.marginHealth}`}
            style={{ width: `${progress}%` }}
          ></span>
        </div>

        <div className="quotation-margin-rows">
          <div>
            <span>Client Total</span>
            <strong>{formatQuotationMoney(totals.grandTotal, totals.currency)}</strong>
          </div>
          <div>
            <span>Supplier Cost</span>
            <strong className="cost">
              {formatQuotationMoney(totals.supplierTotal, totals.currency)}
            </strong>
          </div>
          <div className="highlight">
            <span>Gross Profit</span>
            <strong>{formatQuotationMoney(margin.grossProfit, totals.currency)}</strong>
          </div>
        </div>

        <div className={`quotation-margin-health ${margin.marginHealth}`}>
          <strong>{getMarginHealthTitle(margin.marginHealth)}</strong>
          {getMarginHealthLabel(margin.marginHealth)}
        </div>

        <div className="quotation-margin-rows compact">
          <div>
            <span>Total Quantity</span>
            <strong>{totals.totalQuantity.toLocaleString("en-US")}</strong>
          </div>
          <div>
            <span>Freight</span>
            <strong>{formatQuotationMoney(totals.freight, totals.currency)}</strong>
          </div>
          <div>
            <span>Discount</span>
            <strong>
              {formatQuotationMoney(totals.discountAmount, totals.currency)}
            </strong>
          </div>
        </div>

        <div className="quotation-min-price">
          <span>Min Sell Price (10% margin)</span>
          <strong>{formatQuotationMoney(margin.minSellPrice, totals.currency)}</strong>
        </div>
      </section>
    </aside>
  );
};

export default QuotationMarginSidebar;
