const ChemicalSuggestions = ({ suggestions, chemicals, addSuggestion }) => {
  const chemicalNames = new Set(
    chemicals.map((chemical) => chemical.name.toLowerCase()),
  );

  return (
    <div className="suggestion-area">
      <div className="suggestion-label">
        <i className="bi bi-lightning-charge me-1"></i>
        Quick add common chemicals:
      </div>

      <div className="suggestion-pills">
        {suggestions.map((suggestion) => {
          const isAdded = chemicalNames.has(suggestion.name.toLowerCase());

          return (
            <button
              key={suggestion.name}
              type="button"
              className={`suggestion-pill ${isAdded ? "added" : ""}`}
              onClick={() => addSuggestion(suggestion)}
            >
              + {suggestion.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChemicalSuggestions;
