
import { Heart, Mail, MessageSquare, Phone, Settings, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackTemplate } from "@/lib/db/schema/feedback-template"
import { TemplateQuestion } from "@/lib/db/schema/template-questions"

interface TemplatePreviewModalProps {
  template: FeedbackTemplate;
  questions: TemplateQuestion[];
  isOpen: boolean;
  onClose: () => void;
  onManageTemplate: (templatedId: string) => void;
}

const TemplatePreviewModal = ({ template, isOpen, onClose, onManageTemplate, questions }: TemplatePreviewModalProps) => {
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Phone className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };


  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'email': return 'bg-blue-50 border-blue-200';
      case 'sms': return 'bg-green-50 border-green-200';
      case 'whatsapp': return 'bg-emerald-50 border-emerald-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };


  const renderQuestion = (question: TemplateQuestion, index: number) => {
    return (
      <Card key={question.id} className="border-l-4 border-l-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">
                  {question.questionText}
                  {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                </h3>

                <div className="mt-3">
                  {question.inputFieldType === 'input' && (
                    <Input
                      placeholder="Type your answer here..."
                      className="max-w-md"
                    />
                  )}

                  {question.inputFieldType === 'textarea' && (
                    <Textarea
                      placeholder="Type your detailed response here..."
                      rows={4}
                      className="max-w-lg"
                    />
                  )}

                  {question.inputFieldType === 'radio' && question.options && (
                    <RadioGroup
                      className="space-y-2"
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                          <Label htmlFor={`${question.id}-${optionIndex}`} className="font-normal">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.inputFieldType === 'checkbox' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${question.id}-${optionIndex}`}
                          />
                          <Label htmlFor={`${question.id}-${optionIndex}`} className="font-normal">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg border-2 ${getChannelColor(template.channel as string)}`}>
                {getChannelIcon(template.channel as string)}
              </div>
              <div>
                <DialogTitle className="text-xl">Customer Feedback Preview</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  How customers will see "{template.name}" template
                </p>
              </div>
            </div>
            <Button
              onClick={()=>onManageTemplate(template.id)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Manage Template
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-6 p-4">
            {/* Template Header */}
            <Card className={`border-2 ${getChannelColor(template.channel as string)}`}>
              <CardHeader className="text-center pb-4">
                {template.displayCompanyLogo && template.companyLogo && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={template.companyLogo}
                      alt="Company logo"
                      className="h-16 w-16 rounded-lg object-cover shadow-sm"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <h1 className="text-2xl font-bold text-gray-900">We Value Your Feedback</h1>
                    <Heart className="h-5 w-5 text-red-500" />
                  </div>

                  {template.displayCompanyStatement && template.companyStatement && (
                    <p className="text-gray-600 italic max-w-md mx-auto">
                      "{template.companyStatement}"
                    </p>
                  )}

                  <div className="flex justify-center mt-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getChannelIcon(template.channel  as string)}
                      <span className="capitalize">Sent via {template.channel}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Separator />

            {/* Questions */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Please share your thoughts</h2>
                <p className="text-sm text-gray-600">Your responses help us improve our services</p>
              </div>

              {questions.map((question, index) => renderQuestion(question, index))}
            </div>

            {/* Submit Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Thank you for your time!</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Your feedback is important to us and helps us serve you better.
                    </p>
                  </div>
                  <Button disabled size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Submit Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 pt-4 border-t">
              <p>This is a preview of how your customers will see this feedback template.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewModal;