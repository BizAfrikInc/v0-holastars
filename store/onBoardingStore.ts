import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Business, Department, Location } from "@/lib/helpers/types";

interface Step {
  id: string;
  title: string;
  required: boolean;
}

type StepID = Step["id"];

interface OnboardingState {
  steps: Step[];
  currentStepIndex: number;
  completedSteps: StepID[];
  onBoardingComplete: boolean;

  businessAdded?: Business ;
  locationsAdded: Location[];
  departmentsAdded: Department[];

  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleCompleteStep: (stepId: StepID) => void;
  addBusiness: (business: Business) => void;
  addLocation: (location: Location) => void;
  addDepartment: (department: Department) => void;
  resetOnboarding: () => void;
}

const steps: Step[] = [
  { id: "business", title: "Register Business", required: true },
  { id: "locations", title: "Add Locations", required: true },
  { id: "departments", title: "Add Departments", required: false },
  { id: "completion", title: "Complete Setup", required: true },
];

const initialOnboardingState = {
  steps,
  currentStepIndex: 0,
  completedSteps: [] as StepID[],
  onBoardingComplete: false,
  locationsAdded: [] as Location[],
  departmentsAdded: [] as Department[],
};

export const useOnboardingState = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialOnboardingState,

      handleNextStep: () =>
        set((s) => ({
          currentStepIndex: Math.min(s.currentStepIndex + 1, s.steps.length - 1),
        })),

      handlePreviousStep: () =>
        set((s) => ({
          currentStepIndex: Math.max(s.currentStepIndex - 1, 0),
        })),

      handleCompleteStep: (stepId) =>
        set((s) => {
          const list = s.completedSteps.includes(stepId)
            ? s.completedSteps
            : [...s.completedSteps, stepId];
          return {
            completedSteps: list,
            onBoardingComplete: s.steps
              .filter((st) => st.required)
              .every((st) => list.includes(st.id)),
          };
        }),

      addBusiness: (business) => {
        set({ businessAdded: business });
        get().handleCompleteStep("business");
      },

      addLocation: (location) => {
        set((s) => ({
          locationsAdded: [...s.locationsAdded, location],
        }));
        get().handleCompleteStep("locations");
      },

      addDepartment: (department: Department) => {
        set((s) => ({
          departmentsAdded: [...s.departmentsAdded, department],
        }));
        get().handleCompleteStep("departments");
      },

      resetOnboarding: () => set(initialOnboardingState),
    }),
    {
      name: "onboarding-state",
    }
  )
);
