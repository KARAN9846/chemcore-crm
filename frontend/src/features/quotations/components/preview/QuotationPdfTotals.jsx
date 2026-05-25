import { formatPdfMoney } from "../../utils/quotationPdfUtils";

const QuotationPdfTotals = ({ quotation }) => (
  <section className="quotation-pdf-totals">
    <div className="quotation-pdf-totals-card">
      <div>
        <span>Subtotal</span>
        <strong>{formatPdfMoney(quotation?.subtotal, quotation?.currency)}</strong>
      </div>
      <div>
        <span>Freight</span>
        <strong>{formatPdfMoney(quotation?.freightTotal, quotation?.currency)}</strong>
      </div>
      <div>
        <span>Discount</span>
        <strong>{formatPdfMoney(quotation?.discountTotal, quotation?.currency)}</strong>
      </div>
      <div>
        <span>Tax / GST</span>
        <strong>Exempt (Export)</strong>
      </div>
      <div className="grand">
        <span>Grand Total</span>
        <strong>{formatPdfMoney(quotation?.grandTotal, quotation?.currency)}</strong>
      </div>
    </div>
  </section>
);

export default QuotationPdfTotals;
