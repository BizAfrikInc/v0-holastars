
import { useState } from "react";
import OnboardingWizard from "@/components/dashboard/onboarding/OnboardingWizard"
import { Button } from "@/components/ui/button";
import CustomAlert from "@/components/ui/CustomAlert";
import { useOnboardingState } from "@/store/onBoardingStore"

const BusinessRegistrationBanner = () => {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false)
  const {onBoardingComplete, completedSteps} = useOnboardingState()
  if (showOnboarding) {
    return (
      <OnboardingWizard
        onComplete={() => {
          setShowOnboarding(false);
        }}
        onSkip={() => {
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <CustomAlert
      variant="warning"
      title="Complete Your Setup"
      closable={false}
    >
      Complete your business setup to unlock all features and tools available to you.
      <Button
        variant="outline"
        size="sm"
        className="ml-4"
        onClick={() => setShowOnboarding(true)}
      >
        {
          !onBoardingComplete &&  completedSteps.length > 0 ? "Resume Business Setup" : "Business Setup"
        }
      </Button>
    </CustomAlert>
  );
};

export default BusinessRegistrationBanner;