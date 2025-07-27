"use client"
import { ArrowLeft, ArrowRight, X } from "lucide-react"
import BusinessRegistrationStep from "@/components/dashboard/onboarding/BusinessRegistrationStep"
import CompletionStep from "@/components/dashboard/onboarding/CompletionStep"
import DepartmentsStep from "@/components/dashboard/onboarding/DepartmentsStep"
import LocationsStep from "@/components/dashboard/onboarding/LocationsSteps"
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Business, Department, Location } from "@/lib/helpers/types"
import { useOnboardingState } from "@/store/onBoardingStore"

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingWizard = ({ onComplete, onSkip }: OnboardingWizardProps) => {
  const {
    steps,
    currentStepIndex,
    completedSteps,
    businessAdded,
    locationsAdded,
    departmentsAdded,
    handleNextStep,
    handlePreviousStep,
    addBusiness,
    addLocation,
    addDepartment,
    handleCompleteStep
  } = useOnboardingState();


  const { toast } = useToast();

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep?.id) {
      case "business":
        return (
          <BusinessRegistrationStep
            business={businessAdded}
            onComplete={(biz: Business) => {
              addBusiness(biz);
              handleNextStep();
            }}
          />
        );

      case "locations":
        return (
          <LocationsStep
            locations={locationsAdded}
            onLocationAdded={(loc: Location) => {
              addLocation(loc);
              toast({
                title: "Location added!",
                description: `${loc.name} successfully added.`,
              });
            }}
            onNext={handleNextStep}
            canProceed={locationsAdded.length > 0}
          />
        );

      case "departments":
        return (
          <DepartmentsStep
            departments={departmentsAdded}
            locations={locationsAdded}
            onDepartmentAdded={(dpt: Department) => {
              addDepartment(dpt);
              toast({
                title: "Department added!",
                description: `${dpt.name} successfully added.`,
              });
            }}
            onNext={handleNextStep}
            onSkip={handleNextStep}
          />
        );

      case "completion":
        return (
          <CompletionStep
            businessData={businessAdded!}
            locationsCount={locationsAdded.length}
            departmentsCount={departmentsAdded.length}
            onComplete={() => {
              onComplete();
              handleCompleteStep(currentStep.id)
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Business Setup</h1>
            <p className="text-muted-foreground">
              Step {currentStepIndex + 1} of {steps.length}:{" "}
              {currentStep?.title}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSkip}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step */}
        <div className="mb-8">{renderStep()}</div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {!currentStep?.required &&
            currentStepIndex < steps.length - 1 && (
              <Button
                variant="ghost"
                onClick={handleNextStep}
              >
                Skip Step
              </Button>
            )}
          {currentStep?.id &&  completedSteps.includes(currentStep.id) && (
            <Button
              variant="outline"
              onClick={handleNextStep}
            >
              <ArrowRight className="h-4 w-4" />
              Next
            </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;