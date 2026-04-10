import { useRef } from "react";

const COLOR_SWATCHES = [
  "#1f7a35",
  "#1a5c8a",
  "#7a1a5c",
  "#8a3a1a",
  "#1a5c7a",
  "#0d2b1a",
  "#5c1a1a",
  "#2d4a8a",
];

const BrandColorPicker = ({ value, error, touched, onChange, onBlur }) => {
  const colorInputRef = useRef(null);

  return (
    <div className="form-section">
      <div className="section-heading">
        <i className="bi bi-palette2"></i> Brand Color
      </div>

      <label className="form-label">
        Choose your primary brand color <span className="req">*</span>
      </label>

      <div className="color-swatches">
        {COLOR_SWATCHES.map((color) => (
          <button
            key={color}
            type="button"
            className={`swatch ${value === color ? "selected" : ""}`}
            style={{ background: color }}
            onClick={() => onChange("primaryColor", color)}
            aria-label={`Select ${color}`}
          ></button>
        ))}
      </div>

      <div className="color-custom">
        <button
          type="button"
          className="color-preview-box"
          style={{ background: value }}
          onClick={() => colorInputRef.current?.click()}
          aria-label="Choose custom color"
        ></button>

        <input
          ref={colorInputRef}
          name="primaryColor"
          id="branding-color-picker"
          type="color"
          value={value}
          onChange={(e) => onChange("primaryColor", e.target.value)}
          onBlur={() => onBlur("primaryColor")}
        />

        <div>
          <div className="color-custom-label">Custom color</div>
          <div className="color-custom-value">{value}</div>
        </div>
      </div>

      <div className="form-hint">
        Used in the navigation bar, buttons, highlights and PDF headers.
      </div>

      {touched && error ? <div className="field-feedback">{error}</div> : null}
    </div>
  );
};

export default BrandColorPicker;
