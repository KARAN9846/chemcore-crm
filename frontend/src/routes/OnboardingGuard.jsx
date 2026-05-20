import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { getOnboardingStatus } from "../api/onboarding.api";
import { getCompanyId } from "../utils/company";
import { clearOnboardingStorage } from "../utils/onboardingStorage";

const getStepPath = (step) => `/onboarding/step${step}`;
const isMissingCompanyError = (error) =>
  error.response?.status === 404 &&
  error.response?.data?.message === "Company not found";

const OnboardingGuard = ({ step, children }) => {
  const location = useLocation();
  const livePathname = location.pathname;
  const latestPathnameRef = useRef(livePathname);
  const [statusState, setStatusState] = useState({
    pathname: null,
    data: null,
  });
  const [loading, setLoading] = useState(true);

  latestPathnameRef.current = livePathname;

  useEffect(() => {
    let isMounted = true;
    const requestPathname = livePathname;

    const syncStatus = async () => {
      setLoading(true);

      const activeCompanyId = getCompanyId();

      if (!activeCompanyId) {
        if (isMounted) {
          setStatusState({
            pathname: requestPathname,
            data: null,
          });
          setLoading(false);
        }
        return;
      }

      try {
        const response = await getOnboardingStatus(activeCompanyId);
        const nextStatus = response?.data || null;

        if (
          !isMounted ||
          latestPathnameRef.current !== requestPathname
        ) {
          return;
        }

        setStatusState({
          pathname: requestPathname,
          data: nextStatus,
        });
      } catch (error) {
        if (isMissingCompanyError(error)) {
          clearOnboardingStorage();

          if (isMounted && latestPathnameRef.current === requestPathname) {
            setStatusState({
              pathname: requestPathname,
              data: null,
            });
          }

          return;
        }

        console.error("Onboarding status error:", error);
      } finally {
        if (
          isMounted &&
          latestPathnameRef.current === requestPathname
        ) {
          setLoading(false);
        }
      }
    };

    syncStatus();

    return () => {
      isMounted = false;
    };
  }, [livePathname]);

  const statusBelongsToLivePath = statusState.pathname === livePathname;
  const status = statusBelongsToLivePath ? statusState.data : null;

  if (loading || !statusBelongsToLivePath) {
    return null;
  }

  if (!status) {
    if (step === 1 || livePathname === "/onboarding/step1") {
      return children;
    }

    return <Navigate to="/onboarding/step1" replace />;
  }

  if (status.onboarding_completed && !location.state?.justCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  const activeStep = Number(status.onboarding_step) || 1;
  const allowedPath = getStepPath(activeStep);

  if (step > activeStep) {
    if (livePathname === allowedPath) {
      return children;
    }

    return <Navigate to={allowedPath} replace />;
  }

  return children;
};

export default OnboardingGuard;
