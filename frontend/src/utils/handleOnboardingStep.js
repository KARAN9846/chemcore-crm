export const handleOnboardingStep = async ({
  saveFn,
  nextRoute,
  navigate,
  navigateOptions,
}) => {
  console.log("BUTTON CLICKED");
  console.log("SAVE START");

  const saveResult = await saveFn();

  if (saveResult?.success === false) {
    throw new Error(saveResult.message || "Onboarding step save failed");
  }

  console.log("SAVE COMPLETE");
  console.log("NAVIGATING", nextRoute);
  navigate(nextRoute, navigateOptions);

  return saveResult;
};
