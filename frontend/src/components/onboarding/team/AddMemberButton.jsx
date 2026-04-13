const AddMemberButton = ({ addMember }) => {
  return (
    <button type="button" className="btn-add-invite" onClick={addMember}>
      <i className="bi bi-plus-circle"></i> Add Another Team Member
    </button>
  );
};

export default AddMemberButton;
