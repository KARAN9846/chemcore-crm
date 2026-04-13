const MemberRow = ({
  member,
  index,
  membersLength,
  roles,
  updateMember,
  removeMember,
}) => {
  return (
    <div className="invite-row">
      <div className="invite-row-header">
        <span className="invite-row-num">Member #{index + 1}</span>

        {membersLength > 1 ? (
          <button
            type="button"
            className="btn-remove-invite"
            onClick={() => removeMember(member.id)}
            aria-label={`Remove member ${index + 1}`}
            title="Remove"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        ) : null}
      </div>

      <div>
        <label
          className="form-label"
          htmlFor={`member-name-${member.id}`}
          style={{ fontSize: "11.5px" }}
        >
          Full Name <span className="req">*</span>
        </label>
        <input
          id={`member-name-${member.id}`}
          type="text"
          className="form-control"
          placeholder="e.g. Priya Sharma"
          value={member.name}
          onChange={(event) =>
            updateMember(member.id, "name", event.target.value)
          }
        />
      </div>

      <div>
        <label
          className="form-label"
          htmlFor={`member-email-${member.id}`}
          style={{ fontSize: "11.5px" }}
        >
          Email <span className="req">*</span>
        </label>
        <input
          id={`member-email-${member.id}`}
          type="email"
          className="form-control"
          placeholder="name@company.com"
          value={member.email}
          onChange={(event) =>
            updateMember(member.id, "email", event.target.value)
          }
        />
      </div>

      <div>
        <label
          className="form-label"
          htmlFor={`member-role-${member.id}`}
          style={{ fontSize: "11.5px" }}
        >
          Role <span className="req">*</span>
        </label>
        <select
          id={`member-role-${member.id}`}
          className="form-select"
          value={member.role}
          onChange={(event) =>
            updateMember(member.id, "role", event.target.value)
          }
        >
          <option value="">Role</option>
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.value}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          paddingTop: "22px",
        }}
      >
        <button
          type="button"
          className="btn-remove-invite"
          onClick={() => removeMember(member.id)}
          disabled={membersLength === 1}
          aria-label={`Delete member ${index + 1}`}
          style={{
            width: "36px",
            height: "36px",
            border: "1.5px solid var(--gray-200)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i className="bi bi-trash3" style={{ fontSize: "13px" }}></i>
        </button>
      </div>
    </div>
  );
};

export default MemberRow;
