import { memo } from "react";

import LeadFormSection from "../common/LeadFormSection";

const LeadContactSection = ({
  data,
  errors = {},
  touched = {},
  submitAttempted,
  onInputChange,
  onFieldBlur,
}) => {
  const updateField = (field) => (event) => {
    onInputChange("contact", field, event.target.value);
  };
  const getError = (field) =>
    submitAttempted || touched[field] ? errors[field] : "";
  const controlClass = (field) =>
    `lead-form-control ${getError(field) ? "lead-form-control-invalid" : ""}`;

  return (
    <LeadFormSection icon="bi-person-lines-fill" title="Contact Information">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="lead-form-label" htmlFor="lead-first-name">
            First Name <span className="req">*</span>
          </label>
          <input
            id="lead-first-name"
            type="text"
            className={controlClass("firstName")}
            placeholder="e.g. Mohammed"
            value={data.firstName}
            onChange={updateField("firstName")}
            onBlur={() => onFieldBlur("contact", "firstName")}
            aria-invalid={Boolean(getError("firstName"))}
          />
          {getError("firstName") ? (
            <div className="lead-field-error">{getError("firstName")}</div>
          ) : null}
        </div>

        <div className="col-md-6">
          <label className="lead-form-label" htmlFor="lead-last-name">
            Last Name <span className="req">*</span>
          </label>
          <input
            id="lead-last-name"
            type="text"
            className={controlClass("lastName")}
            placeholder="e.g. Al Khatib"
            value={data.lastName}
            onChange={updateField("lastName")}
            onBlur={() => onFieldBlur("contact", "lastName")}
          />
        </div>

        <div className="col-md-8">
          <label className="lead-form-label" htmlFor="lead-company">
            Company Name <span className="req">*</span>
          </label>
          <input
            id="lead-company"
            type="text"
            className={controlClass("companyName")}
            placeholder="e.g. Al Khatib Trading WLL"
            value={data.companyName}
            onChange={updateField("companyName")}
            onBlur={() => onFieldBlur("contact", "companyName")}
            aria-invalid={Boolean(getError("companyName"))}
          />
          {getError("companyName") ? (
            <div className="lead-field-error">{getError("companyName")}</div>
          ) : null}
        </div>

        <div className="col-md-4">
          <label className="lead-form-label" htmlFor="lead-designation">
            Designation
          </label>
          <input
            id="lead-designation"
            type="text"
            className={controlClass("designation")}
            placeholder="e.g. Procurement Director"
            value={data.designation}
            onChange={updateField("designation")}
            onBlur={() => onFieldBlur("contact", "designation")}
          />
        </div>

        <div className="col-md-6">
          <label className="lead-form-label" htmlFor="lead-email">
            Email <span className="req">*</span>
          </label>
          <input
            id="lead-email"
            type="email"
            className={controlClass("email")}
            placeholder="name@company.com"
            value={data.email}
            onChange={updateField("email")}
            onBlur={() => onFieldBlur("contact", "email")}
            aria-invalid={Boolean(getError("email"))}
          />
          {getError("email") ? (
            <div className="lead-field-error">{getError("email")}</div>
          ) : null}
        </div>

        <div className="col-md-6">
          <label className="lead-form-label" htmlFor="lead-phone">
            Phone / WhatsApp
          </label>
          <input
            id="lead-phone"
            type="tel"
            className={controlClass("phone")}
            placeholder="+965 5512 3456"
            value={data.phone}
            onChange={updateField("phone")}
            onBlur={() => onFieldBlur("contact", "phone")}
            aria-invalid={Boolean(getError("phone"))}
          />
          {getError("phone") ? (
            <div className="lead-field-error">{getError("phone")}</div>
          ) : null}
        </div>

        <div className="col-md-6">
          <label className="lead-form-label" htmlFor="lead-country">
            Country <span className="req">*</span>
          </label>
          <select
            id="lead-country"
            className={controlClass("country")}
            value={data.country}
            onChange={updateField("country")}
            onBlur={() => onFieldBlur("contact", "country")}
            aria-invalid={Boolean(getError("country"))}
          >
            <option value="">Select country</option>
            <option>Kuwait</option>
            <option>UAE</option>
            <option>Saudi Arabia</option>
            <option>Brazil</option>
            <option>Vietnam</option>
            <option>Indonesia</option>
            <option>Egypt</option>
            <option>Nigeria</option>
            <option>Belgium</option>
            <option>Germany</option>
            <option>South Korea</option>
            <option>India</option>
            <option>Kazakhstan</option>
            <option>Poland</option>
          </select>
          {getError("country") ? (
            <div className="lead-field-error">{getError("country")}</div>
          ) : null}
        </div>

        <div className="col-md-6">
          <label className="lead-form-label" htmlFor="lead-city">
            City
          </label>
          <input
            id="lead-city"
            type="text"
            className={controlClass("city")}
            placeholder="e.g. Kuwait City"
            value={data.city}
            onChange={updateField("city")}
            onBlur={() => onFieldBlur("contact", "city")}
          />
        </div>
      </div>
    </LeadFormSection>
  );
};

export default memo(LeadContactSection);
