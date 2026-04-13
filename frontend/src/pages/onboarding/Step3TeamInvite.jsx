import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/layout/TopBar";
import ProgressBar from "../../components/onboarding/layout/ProgressBar";
import AddMemberButton from "../../components/onboarding/team/AddMemberButton";
import InviteStats from "../../components/onboarding/team/InviteStats";
import MemberList from "../../components/onboarding/team/MemberList";
import RoleCards from "../../components/onboarding/team/RoleCards";
import { useOnboarding } from "../../context/OnboardingContext";

const ROLE_OPTIONS = [
  {
    value: "Sales",
    icon: "📊",
    description: "Leads, quotations, client conversations",
    badgeClass: "sales",
    badgeLabel: "Sales",
  },
  {
    value: "Operations",
    icon: "🚢",
    description: "Orders, POs, shipping, compliance docs",
    badgeClass: "ops",
    badgeLabel: "Ops",
  },
  {
    value: "Accounts",
    icon: "💰",
    description: "Payments, invoices, P&L reports",
    badgeClass: "accounts",
    badgeLabel: "Accounts",
  },
  {
    value: "Admin",
    icon: "⚙️",
    description: "Full access to all modules and settings",
    badgeClass: "admin",
    badgeLabel: "Admin",
  },
];

const createMember = (id) => ({
  id,
  name: "",
  email: "",
  role: "",
});

const Step3TeamInvite = () => {
  const navigate = useNavigate();
  const { companyId, currentStep, isHydrated } = useOnboarding();
  const [members, setMembers] = useState([createMember(1)]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!companyId || currentStep < 3) {
      navigate("/onboarding/step-2", { replace: true });
    }
  }, [companyId, currentStep, isHydrated, navigate]);

  if (!isHydrated || !companyId || currentStep < 3) {
    return null;
  }

  const updateMember = (id, field, value) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, [field]: value } : member,
      ),
    );
  };

  const addMember = () => {
    setMembers((prev) => [...prev, createMember(Date.now())]);
  };

  const removeMember = (id) => {
    setMembers((prev) => {
      if (prev.length === 1) {
        return [createMember(Date.now())];
      }

      return prev.filter((member) => member.id !== id);
    });
  };

  const invitedCount = members.filter(
    (member) => member.name || member.email || member.role,
  ).length;
  const seatUsagePercent = Math.min((invitedCount / 10) * 100, 100);

  return (
    <div className="step3">
      <TopBar variant="secure" />
      <ProgressBar currentStep={3} />

      <div className="main-wrap">
        <div className="form-container step3-form-container">
          <div className="step-header">
            <div className="step-badge">
              <i className="bi bi-people"></i> Step 3 of 6
            </div>

            <h2 className="step-title">Invite Your Team</h2>

            <p className="step-sub">
              Add team members and assign their roles. They&apos;ll receive an
              email invite with a link to set their password. You can add more
              later from User Management.
            </p>
          </div>

          <div className="plan-limit-bar">
            <i
              className="bi bi-people-fill"
              style={{ color: "var(--g600)", fontSize: "18px" }}
            ></i>

            <div className="limit-progress" style={{ flex: 1 }}>
              <div className="limit-text">
                <strong>{invitedCount}</strong> of <strong>10</strong> seats
                used (Growth Plan)
              </div>

              <div
                className="limit-bar-track mt-1"
                style={{
                  height: "6px",
                  background: "var(--gray-200)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="limit-bar-fill"
                  style={{
                    width: `${seatUsagePercent}%`,
                    height: "100%",
                    background: "var(--g500)",
                    borderRadius: "3px",
                    transition: "width .4s",
                  }}
                ></div>
              </div>
            </div>

            <a
              href="#"
              onClick={(event) => event.preventDefault()}
              style={{
                fontSize: "11.5px",
                color: "var(--g600)",
                textDecoration: "none",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              Upgrade for more →
            </a>
          </div>

          <RoleCards roles={ROLE_OPTIONS} />

          <form noValidate onSubmit={(event) => event.preventDefault()}>
            <InviteStats members={members} />

            <MemberList
              members={members}
              roles={ROLE_OPTIONS}
              updateMember={updateMember}
              removeMember={removeMember}
            />

            <AddMemberButton addMember={addMember} />

            <span className="skip-link">
              Don&apos;t want to invite anyone now?{" "}
              <a
                href="/onboarding/step-4"
                onClick={(event) => {
                  event.preventDefault();
                }}
              >
                Skip this step →
              </a>
            </span>

            <div className="form-actions">
              <a
                href="/onboarding/step-2"
                className="btn-back"
                onClick={(event) => {
                  event.preventDefault();
                  navigate("/onboarding/step-2");
                }}
              >
                <i className="bi bi-arrow-left"></i> Back
              </a>

              <button type="button" className="btn-next">
                Send Invites & Continue <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step3TeamInvite;
