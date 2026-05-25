const labels = {
  added: "Added",
  removed: "Removed",
  changed: "Changed",
  unchanged: "Unchanged",
};

const CompareChangeLogTable = ({ changes = [], leftLabel, rightLabel }) => (
  <section className="quotation-change-log">
    <header>
      <i className="bi bi-list-check" aria-hidden="true"></i>
      Full Change Log
    </header>
    <div>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>{rightLabel}</th>
            <th>{leftLabel}</th>
            <th>Change Type</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((change) => (
            <tr key={change.field}>
              <td>{change.field}</td>
              <td>{change.oldValue}</td>
              <td>{change.currentValue}</td>
              <td>
                <span className={`quotation-change-badge ${change.changeType}`}>
                  {labels[change.changeType] || change.changeType}
                </span>
              </td>
              <td>{change.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default CompareChangeLogTable;
