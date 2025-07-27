
import { CheckCircle, Mail, MessageSquare, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TemplateData, TemplateQuestion } from "./CreateTemplateModal";

interface TemplateReviewStepProps {
  templateData: TemplateData;
  questions: TemplateQuestion[];
  onSubmit: () => void;
  isSubmitting: boolean;
}

const TemplateReviewStep = ({ templateData, questions, onSubmit, isSubmitting }: TemplateReviewStepProps) => {
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
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'sms': return 'bg-green-100 text-green-800';
      case 'whatsapp': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFieldTypeLabel = (type: string) => {
    switch (type) {
      case 'input': return 'Text Input';
      case 'textarea': return 'Long Text';
      case 'radio': return 'Single Choice';
      case 'checkbox': return 'Multiple Choice';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
    <div className="text-center">
    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
    <h2 className="text-2xl font-bold">Review Your Template</h2>
  <p className="text-muted-foreground">
    Please review all the details before creating your template
  </p>
  </div>

  <Card>
  <CardHeader>
    <CardTitle>Template Details</CardTitle>
  <CardDescription>Basic information about your template</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
  <div className="grid grid-cols-2 gap-4">
  <div>
    <h4 className="font-medium text-sm text-muted-foreground">Template Name</h4>
  <p className="font-medium">{templateData.name}</p>
  </div>
  <div>
  <h4 className="font-medium text-sm text-muted-foreground">Channel</h4>
    <Badge className={getChannelColor(templateData.channel)}>
  {getChannelIcon(templateData.channel)}
  <span className="ml-1 capitalize">{templateData.channel}</span>
  </Badge>
  </div>
  </div>

  <Separator />

  <div className="space-y-3">
  <h4 className="font-medium">Branding Options</h4>

  <div className="flex items-center justify-between py-2">
  <span className="text-sm">Display Company Logo</span>
  <Badge variant={templateData.displayCompanyLogo ? "default" : "secondary"}>
    {templateData.displayCompanyLogo ? "Enabled" : "Disabled"}
    </Badge>
    </div>

  {templateData.displayCompanyLogo && templateData.companyLogo && (
    <div className="pl-4 border-l-2 border-muted">
    <p className="text-sm text-muted-foreground">Logo URL:</p>
  <p className="text-sm font-mono break-all">{templateData.companyLogo}</p>
    </div>
  )}

  <div className="flex items-center justify-between py-2">
  <span className="text-sm">Display Company Statement</span>
  <Badge variant={templateData.displayCompanyStatement ? "default" : "secondary"}>
    {templateData.displayCompanyStatement ? "Enabled" : "Disabled"}
    </Badge>
    </div>

  {templateData.displayCompanyStatement && templateData.companyStatement && (
    <div className="pl-4 border-l-2 border-muted">
    <p className="text-sm text-muted-foreground">Statement:</p>
  <p className="text-sm italic">"{templateData.companyStatement}"</p>
    </div>
  )}
  </div>
  </CardContent>
  </Card>

  <Card>
  <CardHeader>
    <CardTitle>Questions ({questions.length})</CardTitle>
  <CardDescription>
  Questions that will be presented to your customers
  </CardDescription>
  </CardHeader>
  <CardContent>
  <div className="space-y-4">
    {questions.map((question, index) => (
        <Card key={question.identifier} className="p-4">
      <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
      <span className="text-sm font-medium text-primary">{index + 1}</span>
        </div>

        <div className="flex-1 space-y-2">
      <div className="flex items-start justify-between">
      <h4 className="font-medium">{question.questionText}</h4>
  {question.isRequired && (
    <Badge variant="destructive" className="text-xs">
    Required
    </Badge>
  )}
  </div>

  <div className="flex gap-2">
  <Badge variant="secondary" className="text-xs">
    {getFieldTypeLabel(question.inputFieldType)}
  </Badge>
  </div>

  {question.options && question.options.length > 0 && (
    <div className="space-y-1">
    <p className="text-xs text-muted-foreground">Options:</p>
  <div className="flex flex-wrap gap-1">
    {question.options.map((option, i) => (
        <Badge key={i} variant="outline" className="text-xs">
        {option}
        </Badge>
  ))}
    </div>
    </div>
  )}
  </div>
  </div>
  </Card>
))}
  </div>
  </CardContent>
  </Card>

  <Card className="bg-muted/50">
  <CardContent className="pt-6">
  <div className="text-center space-y-2">
  <h3 className="font-medium">Ready to Create Template?</h3>
    <p className="text-sm text-muted-foreground">
    Your template will be created with {questions.length} question{questions.length === 1 ? '' : 's'} and can be used to collect feedback from customers.
  </p>
  <Button
  onClick={onSubmit}
  disabled={isSubmitting}
  size="lg"
  className="mt-4"
    >
    {isSubmitting ? 'Creating Template...' : 'Create Template'}
    </Button>
    </div>
    </CardContent>
    </Card>
    </div>
);
};

export default TemplateReviewStep;