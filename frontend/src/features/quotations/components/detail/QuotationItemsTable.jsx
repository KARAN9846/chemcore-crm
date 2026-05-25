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
      <div>
        <h2>Line Items</h2>
        <p>Chemicals, specifications, quantity, pricing and live margin.</p>
      </div>
    </header>
    <div className="quotation-section-body">
      <div className="quotation-line-table-wrap">
        <table className="quotation-line-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Chemical</th>
              <th>Grade / Spec</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Margin</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${item.chemicalName}-${item.sortOrder}`}>
                <td>
                  <span className="quotation-line-index">{item.sortOrder + 1}</span>
                </td>
                <td>
                  <strong>{item.chemicalName}</strong>
                </td>
                <td>{item.gradeSpec || "-"}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{formatQuotationMoney(item.unitPrice, currency)}</td>
                <td className="quotation-line-money">
                  {formatQuotationMoney(item.lineTotal, currency)}
                </td>
                <td>
                  <span className="quotation-line-margin healthy">
                    {formatQuotationPercent(item.marginPercent)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default QuotationItemsTable;
