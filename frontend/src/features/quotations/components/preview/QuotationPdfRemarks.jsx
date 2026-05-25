const QuotationPdfRemarks = ({ quotation }) => (
  <section className="quotation-pdf-remarks">
    <h3>Terms & Conditions</h3>
    <p>
      {quotation?.remarks ||
        "Prices are subject to market conditions and stock availability. COA and MSDS/SDS will be provided where applicable. All export documentation will follow agreed trade terms."}
    </p>
  </section>
);

export default QuotationPdfRemarks;
