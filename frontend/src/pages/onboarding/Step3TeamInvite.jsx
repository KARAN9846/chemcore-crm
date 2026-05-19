import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/layout/TopBar";
import ProgressBar from "../../components/onboarding/layout/ProgressBar";
import AddMemberButton from "../../components/onboarding/team/AddMemberButton";
import InviteStats from "../../components/onboarding/team/InviteStats";
import MemberList from "../../components/onboarding/team/MemberList";
import RoleCards from "../../components/onboarding/team/RoleCards";
import { advanceOnboardingStep } from "../../api/onboarding.api";
import { getTeam } from "../../api/onboardingHydration.api";
import { inviteTeam } from "../../api/team.api";
import { useOnboarding } from "../../context/useOnboarding";
import { getCompanyId } from "../../utils/company";
import { ONBOARDING_KEYS } from "../../utils/onboardingStorage";
import { showError, showLoading, updateToast } from "../../utils/toast";

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
  const { isHydrated, setCurrentStep } = useOnboarding();
  const [members, setMembers] = useState([createMember(1)]);
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    let isMounted = true;

    const hydrateTeam = async () => {
      console.log("HDRATING STEP 3");
      setHydrating(true);

      try {
        const activeCompanyId = getCompanyId();

        if (!activeCompanyId) {
          return;
        }

        const response = await getTeam(activeCompanyId);
        const teamMembers = Array.isArray(response?.data) ? response.data : [];

        console.log("FETCHED DATA:", teamMembers);

        if (isMounted && teamMembers.length > 0) {
          console.log("SETTING FORM STATE");
          setMembers(
            teamMembers.map((member) => ({
              id: member.id,
              name: member.name || "",
              email: member.email || "",
              role: member.role || "",
            })),
          );
        }
      } catch (error) {
        console.error("Team hydration error:", error);
      } finally {
        if (isMounted) {
          setHydrating(false);
        }
      }
    };

    hydrateTeam();

    return () => {
      isMounted = false;
    };
  }, [isHydrated]);

  if (!isHydrated || hydrating) {
    return null;
  }

  const updateMember = (id, field, value) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, [field]: value } : member,
      ),
    );

    setErrors((prev) => {
      if (!prev[id]?.[field]) {
        return prev;
      }

      const updatedMemberErrors = { ...prev[id] };
      delete updatedMemberErrors[field];

      if (Object.keys(updatedMemberErrors).length === 0) {
        const updatedErrors = { ...prev };
        delete updatedErrors[id];
        return updatedErrors;
      }

      return {
        ...prev,
        [id]: updatedMemberErrors,
      };
    });
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

    setErrors((prev) => {
      if (!prev[id]) {
        return prev;
      }

      const updatedErrors = { ...prev };
      delete updatedErrors[id];
      return updatedErrors;
    });
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (loading) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validationErrors = {};

    members.forEach((member) => {
      const memberErrors = {};

      if (!member.name.trim()) {
        memberErrors.name = "Name is required";
      }

      if (!emailRegex.test(member.email)) {
        memberErrors.email = "Valid email required";
      }

      if (!member.role) {
        memberErrors.role = "Role is required";
      }

      if (Object.keys(memberErrors).length > 0) {
        validationErrors[member.id] = memberErrors;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showError("Please fix errors");
      return;
    }

    const toastId = showLoading("Sending invites...");

    try {
      setLoading(true);
      setErrors({});
      console.log("SAVE START");

      const activeCompanyId = getCompanyId();
      console.log("ACTIVE COMPANY ID:", activeCompanyId);

      if (!activeCompanyId) {
        updateToast(toastId, "Company ID missing", "error");
        setLoading(false);
        return;
      }

      const inviteRes = await inviteTeam(activeCompanyId, members);

      if (inviteRes?.success === false) {
        throw new Error(inviteRes.message || "Unable to send invites.");
      }

      console.log("SAVE COMPLETE");
      localStorage.setItem(ONBOARDING_KEYS.STEP, "4");
      setCurrentStep(4);
      updateToast(toastId, "Invites sent successfully", "success");
      console.log("NAVIGATE START");
      navigate("/onboarding/step4");
    } catch (error) {
      console.error("Team invite error:", error);
      updateToast(toastId, error.message || "Something went wrong", "error");
      setLoading(false);
    }
  };

  const skipStep = async (event) => {
    console.log("BUTTON CLICK");
    event?.preventDefault();
    event?.stopPropagation();

    if (loading) {
      return;
    }

    const activeCompanyId = getCompanyId();

    if (!activeCompanyId) {
      showError("Company ID missing");
      return;
    }

    try {
      setLoading(true);
      console.log("SAVE START");

      const skipRes = await advanceOnboardingStep(activeCompanyId, 4);

      if (skipRes?.success === false) {
        throw new Error(skipRes.message || "Unable to skip right now.");
      }

      console.log("SAVE COMPLETE");
      localStorage.setItem(ONBOARDING_KEYS.STEP, "4");
      setCurrentStep(4);
      console.log("NAVIGATE START");
      navigate("/onboarding/step4");
    } catch (error) {
      console.error("Team skip error:", error);
      showError("Unable to skip right now");
      setLoading(false);
    }
  };

  const isFormInvalid = members.some(
    (member) =>
      !member.name.trim() || !member.email.includes("@") || !member.role,
  );

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

          <form
            noValidate
            onSubmit={(event) => {
              console.log("FORM SUBMIT");
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <InviteStats members={members} />

            <MemberList
              members={members}
              roles={ROLE_OPTIONS}
              errors={errors}
              updateMember={updateMember}
              removeMember={removeMember}
            />

            <AddMemberButton addMember={addMember} />

            <span className="skip-link">
              Don&apos;t want to invite anyone now?{" "}
              <a
                href="/onboarding/step4"
                onClick={skipStep}
              >
                Skip this step →
              </a>
            </span>

            <div className="form-actions">
              <a
                href="/onboarding/step2"
                className="btn-back"
                onClick={(event) => {
                  event.preventDefault();
                  navigate("/onboarding/step2");
                }}
              >
                <i className="bi bi-arrow-left"></i> Back
              </a>

              <button
                type="button"
                className="btn-next"
                onClick={(event) => {
                  console.log("BUTTON CLICK");
                  handleSubmit(event);
                }}
                disabled={loading || isFormInvalid}
              >
                {loading ? "Sending..." : "Send Invites & Continue"}{" "}
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step3TeamInvite;
