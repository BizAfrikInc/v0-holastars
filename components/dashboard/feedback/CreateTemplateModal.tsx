
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CreateTemplateWithQuestionsDTO } from "@/lib/helpers/validation-types"
import TemplateDetailsStep from "./TemplateDetailsStep";
import TemplateQuestionsStep from "./TemplateQuestionsStep";
import TemplateReviewStep from "./TemplateReviewStep";

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (templateData: CreateTemplateWithQuestionsDTO) => Promise<void>;
}

export interface TemplateData {
  name: string;
  channel: 'email' | 'sms' | 'whatsapp';
  displayCompanyLogo: boolean;
  companyLogo?: string;
  displayCompanyStatement: boolean;
  companyStatement?: string;
}

export interface TemplateQuestion {
  identifier: string;
  questionText: string;
  inputFieldType: 'input' | 'textarea' | 'radio' | 'checkbox';
  isRequired: boolean;
  options?: string[];
}

const steps = [
  { id: 1, title: "Template Details", description: "Basic information about your template" },
  { id: 2, title: "Add Questions", description: "Create questions for your template" },
  { id: 3, title: "Review & Save", description: "Review and finalize your template" },
];

const CreateTemplateModal = ({ isOpen, onClose, onSubmit }: CreateTemplateModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [templateData, setTemplateData] = useState<TemplateData>({
    name: '',
    channel: 'email',
    displayCompanyLogo: false,
    displayCompanyStatement: false,
  });
  const [questions, setQuestions] = useState<TemplateQuestion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetModal = () => {
    setCurrentStep(1);
    setTemplateData({
      name: '',
      channel: 'email',
      displayCompanyLogo: false,
      displayCompanyStatement: false,
    });
    setQuestions([]);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  type StepFormData = TemplateData | TemplateQuestion[];
  const handleStepSubmit = (data: StepFormData) => {
    if (currentStep === 1) {
      const state = data as TemplateData
      setTemplateData(state);
      handleNext();
    } else if (currentStep === 2) {
      const state = data as TemplateQuestion[];
      setQuestions(state);
      handleNext();
    } else if (currentStep === 3) {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const questionsPayload = questions.map((qn=>{
        const {identifier, ...rest}  = qn
        return rest
      }))
      await onSubmit({ feedbackTemplate: templateData, feedbackTemplateQuestions: questionsPayload });
      handleClose();
    } catch (error) {
      console.error('Failed to create template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return templateData.name.trim().length > 0;
    }
    if (currentStep === 2) {
      return questions.length > 0;
    }
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <TemplateDetailsStep
            data={templateData}
            onSubmit={handleStepSubmit}
          />
        );
      case 2:
        return (
          <TemplateQuestionsStep
            questions={questions}
            onSubmit={handleStepSubmit}
          />
        );
      case 3:
        return (
          <TemplateReviewStep
            templateData={templateData}
            questions={questions}
            onSubmit={handleFinalSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <div className="space-y-2">
            <Progress value={(currentStep / 3) * 100} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex-1 text-center ${
                    currentStep === step.id ? 'text-primary font-medium' : ''
                  }`}
                >
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs">{step.description}</div>
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto py-4">
          {renderStepContent()}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFinalSubmit}
                disabled={!canProceed() || isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Template'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateModal;