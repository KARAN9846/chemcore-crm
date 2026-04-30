import ChemicalRow from "./ChemicalRow";

const ChemicalTable = ({
  chemicals,
  updateChemical,
  removeChemical,
  children,
}) => {
  return (
    <div className="chem-table-wrap">
      <div className="chem-table-header">
        <span>Chemical Name</span>
        <span>Formula / Grade</span>
        <span>Category</span>
        <span>HS Code</span>
        <span>Unit</span>
        <span></span>
      </div>

      <div className="chem-table-body">
        {chemicals.map((chemical) => (
          <ChemicalRow
            key={chemical.id}
            chemical={chemical}
            updateChemical={updateChemical}
            removeChemical={removeChemical}
          />
        ))}
      </div>

      {children}
    </div>
  );
};

export default ChemicalTable;
