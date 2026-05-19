import {
  formatQuotationMoney,
  formatQuotationPercent,
} from "../../utils/quotationDisplayUtils";

const QuotationItemsTable = ({ currency, items }) => (
  <section className="quotation-section">
    <header className="quotation-section-header">
      <span className="quotation-section-icon">
        <i className="bi bi-list-ul" aria-hidden="true"></i>
      </span>
      <h2>Line Items</h2>
    </header>
    <div className="quotation-section-body">
      <div className="quotation-line-table-wrap">
        <table className="quotation-line-table">
          <thead>
            <tr>
              <th>Chemical</th>
              <th>Grade / Spec</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Margin</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${item.chemicalName}-${item.sortOrder}`}>
                <td>{item.chemicalName}</td>
                <td>{item.gradeSpec || "-"}</td>
                <td>
                  {item.quantity} {item.unit}
                </td>
                <td>{formatQuotationMoney(item.unitPrice, currency)}</td>
                <td>{formatQuotationMoney(item.lineTotal, currency)}</td>
                <td>{formatQuotationPercent(item.marginPercent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default QuotationItemsTable;
