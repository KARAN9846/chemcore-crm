const allowedColumns = [1, 2, 3];

const DashboardGrid = ({ columns = 2, children, className = "" }) => {
  const columnCount = allowedColumns.includes(columns) ? columns : 2;
  const gridClassName =
    `dashboard-grid dashboard-grid-${columnCount} ${className}`.trim();

  return <section className={gridClassName}>{children}</section>;
};

export default DashboardGrid;
