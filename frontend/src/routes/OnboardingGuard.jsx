import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { getOnboardingStatus } from "../api/onboarding.api";
import { getCompanyId } from "../utils/company";

const getStepPath = (step) => `/onboarding/step${step}`;

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

        if (nextStatus) {
          const currentStep = Number(nextStatus.onboarding_step) || 1;
          const targetPath = getStepPath(currentStep);

          console.log("GUARD CHECK");
          console.log("GUARD STEP VALUE:", currentStep);
          console.log("LIVE PATHNAME:", latestPathnameRef.current);
          console.log("ALLOWED PATH:", targetPath);
        }

        setStatusState({
          pathname: requestPathname,
          data: nextStatus,
        });
      } catch (error) {
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
      console.log("LIVE PATHNAME:", livePathname);
      console.log("ALLOWED PATH:", "/onboarding/step1");
      console.log("ALLOWING CURRENT ROUTE:", livePathname);
      return children;
    }

    console.log("LIVE PATHNAME:", livePathname);
    console.log("ALLOWED PATH:", "/onboarding/step1");
    console.log("REDIRECTING:", "/onboarding/step1");
    return <Navigate to="/onboarding/step1" replace />;
  }

  if (status.onboarding_completed && !location.state?.justCompleted) {
    console.log("LIVE PATHNAME:", livePathname);
    console.log("ALLOWED PATH:", "/dashboard");
    console.log("REDIRECTING:", "/dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  const activeStep = Number(status.onboarding_step) || 1;
  const allowedPath = getStepPath(activeStep);

  if (step > activeStep) {
    if (livePathname === allowedPath) {
      console.log("LIVE PATHNAME:", livePathname);
      console.log("ALLOWED PATH:", allowedPath);
      console.log("ALLOWING CURRENT ROUTE:", livePathname);
      return children;
    }

    console.log("LIVE PATHNAME:", livePathname);
    console.log("ALLOWED PATH:", allowedPath);
    console.log("REDIRECTING:", allowedPath);
    return <Navigate to={allowedPath} replace />;
  }

  console.log("LIVE PATHNAME:", livePathname);
  console.log("ALLOWED PATH:", allowedPath);
  console.log("ALLOWING CURRENT ROUTE:", livePathname);
  return children;
};

export default OnboardingGuard;
