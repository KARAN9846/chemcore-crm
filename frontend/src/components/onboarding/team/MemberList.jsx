import MemberRow from "./MemberRow";

const MemberList = ({
  members,
  roles,
  errors,
  updateMember,
  removeMember,
}) => {
  return (
    <div className="invite-list">
      {members.map((member, index) => (
        <MemberRow
          key={member.id}
          member={member}
          index={index}
          membersLength={members.length}
          roles={roles}
          errors={errors[member.id]}
          updateMember={updateMember}
          removeMember={removeMember}
        />
      ))}
    </div>
  );
};

export default MemberList;
