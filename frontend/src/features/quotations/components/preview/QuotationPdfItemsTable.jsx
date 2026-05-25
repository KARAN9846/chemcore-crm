import { formatPdfMoney } from "../../utils/quotationPdfUtils";

const QuotationPdfItemsTable = ({ currency, items = [] }) => (
  <table className="quotation-pdf-items-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Chemical / Description</th>
        <th>Qty</th>
        <th>Unit</th>
        <th>Unit Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item, index) => (
        <tr key={`${item.chemicalName}-${index}`}>
          <td>{index + 1}</td>
          <td>
            <strong>{item.chemicalName}</strong>
            <span>{item.gradeSpec || "Standard export grade"}</span>
          </td>
          <td>{item.quantity}</td>
          <td>{item.unit}</td>
          <td>{formatPdfMoney(item.unitPrice, currency)}</td>
          <td>{formatPdfMoney(item.lineTotal, currency)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default QuotationPdfItemsTable;
