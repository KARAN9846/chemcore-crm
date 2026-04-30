import { useState } from "react";

const RATING_LABELS = {
  1: "Poor",
  2: "Below Average",
  3: "Average",
  4: "Good",
  5: "Excellent",
};

const SupplierRating = ({ rating, notes, updateSupplierField }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;
  const ratingLabel = rating
    ? `${rating} out of 5 - ${RATING_LABELS[rating]}`
    : "No rating selected";

  return (
    <div className="form-section">
      <div className="section-heading">
        <i className="bi bi-star"></i> Initial Rating
      </div>

      <label className="form-label">
        Your assessment of this supplier (optional)
      </label>

      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className={`star ${rating >= value ? "active" : ""} ${
              displayRating >= value ? "hover" : ""
            }`}
            onClick={() => updateSupplierField("rating", value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${value} star${value > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>

      <div className="rating-label">{ratingLabel}</div>

      <div className="mt-3">
        <label className="form-label" htmlFor="supplier-notes">
          Notes about this supplier
        </label>
        <textarea
          className="form-control supplier-notes"
          id="supplier-notes"
          rows="2"
          placeholder="e.g. Reliable supplier for bulk Caustic Soda. Competitive pricing. Long-term relationship."
          value={notes}
          onChange={(event) => updateSupplierField("notes", event.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default SupplierRating;
