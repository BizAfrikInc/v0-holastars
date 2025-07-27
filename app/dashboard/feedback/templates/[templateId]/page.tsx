"use client"
import { ArrowLeft, Edit2, GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/LoaderSpinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FeedbackTemplatesApi } from "@/lib/api/template"
import { FeedbackTemplateQuestionsApi } from "@/lib/api/template-question"
import { FeedbackTemplate } from "@/lib/db/schema/feedback-template"
import { NewTemplateQuestion, TemplateQuestion } from "@/lib/db/schema/template-questions"

const TemplateManagement = () => {
  const { templateId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [template, setTemplate] = useState<FeedbackTemplate | null>(null);
  const [questions, setQuestions] = useState<TemplateQuestion[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchTemplateData().then(t=>t);
  }, [templateId]);

  const fetchTemplateData = async () => {
    setIsLoading(true);
    try {
      if (!templateId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: 'TemplateId must be provided',
        });
        return;
      }
      const { data: response } = await FeedbackTemplatesApi.fetchById(templateId as string);
      if(!response.success){
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
        return;
      }
      const {template, questions} = response.data
      setTemplate(template);
      setQuestions(questions);    
    } 
    catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch template data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!template  || !templateId) return;

    setIsSaving(true);
    try {
      const {id, createdAt, updatedAt,  ...rest} = template
      const { data: response } = await FeedbackTemplatesApi.update(rest, templateId as string)
      if(!response.success){
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
        return;
      }
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuestion = async (question: NewTemplateQuestion) => {
    try {
      if(!templateId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Template id must be provided",
        })
        return;
      }
      setShowAddForm(false);
      const { data: response } = await FeedbackTemplateQuestionsApi.create([question])
      if(!response.success){
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
        return;
      }
      toast({
        title: "Success",
        description: "Question added successfully",
      });
      setQuestions(prev => [...prev, response.data]);
    }catch{
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add a new question",
      })
    }

  };

  const handleUpdateQuestion = async (id: string, updatedQuestion: Partial<TemplateQuestion>) => {
  try  {
    const {id: questionId, createdAt, updatedAt,  ...rest} = updatedQuestion
    const { data: response } = await FeedbackTemplateQuestionsApi.update(rest, id);
    if(!response.success){
      toast({
        variant: "destructive",
        title: "Error",
        description: response.message,
      });
      return;
    }
    setQuestions(prev => prev.map(q =>
      q.id === id ? { ...q, ...updatedQuestion } : q
    ));
    setEditingQuestion(null);
    toast({
      title: "Success",
      description: "Question updated successfully",
    });

  }catch{
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to update question",
    })

  }
  };

  const handleDeleteQuestion = async (id: string) => {
    try  {
      const { data: response } = await FeedbackTemplateQuestionsApi.delete(id);
      if(!response.success){
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
        return;
      }
      setQuestions(prev => prev.filter(q => q.id !== id));
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });

    }catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete question",
      })
    }

  };

  if (isLoading) {
    return (
      <div className="flex-1 p-9 space-y-6">
          <LoadingSpinner/>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Template not found</h2>
        <p className="text-muted-foreground mb-4">The template you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/dashboard/feedback/templates')}>
          Back to Templates
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-9 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard/feedback/templates')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Template</h1>
          <p className="text-muted-foreground">
            Edit template details and manage questions
          </p>
        </div>
      </div>

      {/* Template Details */}
      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
          <CardDescription>
            Basic information about your template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                placeholder="Enter template name..."
              />
            </div>

            <div className="space-y-2">
              <Label>Channel</Label>
              <Select
                value={template.channel  as string}
                onValueChange={(value) => setTemplate({ ...template, channel: value as "email" | "sms" | "whatsapp" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Display Company Logo</Label>
                <p className="text-sm text-muted-foreground">
                  Show your company logo in the feedback form
                </p>
              </div>
              <Switch
                checked={template.displayCompanyLogo}
                onCheckedChange={(checked) => setTemplate({ ...template, displayCompanyLogo: checked })}
              />
            </div>

            {template.displayCompanyLogo && (
              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo URL</Label>
                <Input
                  id="logo"
                  value={template.companyLogo || ''}
                  onChange={(e) => setTemplate({ ...template, companyLogo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Display Company Statement</Label>
                <p className="text-sm text-muted-foreground">
                  Show a custom message to your customers
                </p>
              </div>
              <Switch
                checked={template.displayCompanyStatement}
                onCheckedChange={(checked) => setTemplate({ ...template, displayCompanyStatement: checked })}
              />
            </div>

            {template.displayCompanyStatement && (
              <div className="space-y-2">
                <Label htmlFor="statement">Company Statement</Label>
                <Textarea
                  id="statement"
                  value={template.companyStatement || ''}
                  onChange={(e) => setTemplate({ ...template, companyStatement: e.target.value })}
                  placeholder="Enter your company statement..."
                  rows={3}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveTemplate} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Template Questions</CardTitle>
              <CardDescription>
                Manage the questions that will be asked to customers
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No questions added yet</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Question
              </Button>
            </div>
          ) : (
            questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                isEditing={editingQuestion === question.id}
                onEdit={() => setEditingQuestion(question.id)}
                onSave={(data) => handleUpdateQuestion(question.id, data)}
                onCancel={() => setEditingQuestion(null)}
                onDelete={() => handleDeleteQuestion(question.id)}
              />
            ))
          )}

          {showAddForm && (
            <AddQuestionForm
              templateId={templateId as string}
              onSave={handleAddQuestion}
              onCancel={() => setShowAddForm(false)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Component for individual question cards
const QuestionCard = ({ question, index, isEditing, onEdit, onSave, onCancel, onDelete }: {
  question: TemplateQuestion;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: Partial<TemplateQuestion>) => void;
  onCancel: () => void;
  onDelete: () => void;
}) => {
  const [editData, setEditData] = useState(question);

  const getFieldTypeLabel = (type: string) => {
    switch (type) {
      case 'input': return 'Text Input';
      case 'textarea': return 'Long Text';
      case 'radio': return 'Single Choice';
      case 'checkbox': return 'Multiple Choice';
      default: return type;
    }
  };

  if (isEditing) {
    return (
      <Card className="border-primary">
        <CardContent className="pt-6">
          <EditQuestionForm
            question={editData}
            onChange={setEditData}
            onSave={() => onSave(editData)}
            onCancel={onCancel}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex flex-col gap-1 mt-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground text-center">
              {index + 1}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium">{question.questionText}</h4>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Badge variant="secondary">
                {getFieldTypeLabel(question.inputFieldType as string)}
              </Badge>
              {question.isRequired && (
                <Badge variant="destructive">Required</Badge>
              )}
            </div>

            {question.options && question.options.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-1">Options:</p>
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
      </CardContent>
    </Card>
  );
};

// Component for adding new questions
const AddQuestionForm = ({ onSave, onCancel, templateId }: {
  onSave: (question: NewTemplateQuestion) => void;
  onCancel: () => void;
  templateId: string;
}) => {
  const [question, setQuestion] = useState<NewTemplateQuestion>({
    templateId: templateId,
    questionText: '',
    inputFieldType: 'input',
    isRequired: false,
    options: null
  });

  const handleSave = () => {
    if (!question.questionText?.trim()) return;
    onSave(question);
  };

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <EditQuestionForm
          question={question}
          onChange={setQuestion}
          onSave={handleSave}
          onCancel={onCancel}
          isNew={true}
        />
      </CardContent>
    </Card>
  );
};

// Reusable form component for editing questions
const EditQuestionForm = ({ question, onChange, onSave, onCancel, isNew = false }: {
  question: TemplateQuestion | NewTemplateQuestion;
  onChange: (question: TemplateQuestion) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
}) => {
  const [options, setOptions] = useState<string[]>(question.options || []);
  const [newOption, setNewOption] = useState('');

  const needsOptions = ['radio', 'checkbox'].includes(question.inputFieldType || '');

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      const updatedOptions = [...options, newOption.trim()];
      setOptions(updatedOptions);
      onChange({ ...question as TemplateQuestion, options: updatedOptions });
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    onChange({ ...question as TemplateQuestion, options: updatedOptions });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question Text *</Label>
        <Textarea
          value={question.questionText || ''}
          onChange={(e) => onChange({ ...question as TemplateQuestion, questionText: e.target.value })}
          placeholder="Enter your question here..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Input Type</Label>
          <Select
            value={question.inputFieldType || 'input'}
            onValueChange={(value) => onChange({ ...question as TemplateQuestion, inputFieldType: value as 'input' | 'textarea' | 'checkbox' | 'radio' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="input">Text Input</SelectItem>
              <SelectItem value="textarea">Long Text</SelectItem>
              <SelectItem value="radio">Single Choice</SelectItem>
              <SelectItem value="checkbox">Multiple Choice</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label>Required</Label>
          <Switch
            checked={question.isRequired || false}
            onCheckedChange={(checked) => onChange({ ...question as TemplateQuestion, isRequired: checked })}
          />
        </div>
      </div>

      {needsOptions && (
        <div className="space-y-2">
          <Label>Options</Label>
          <div className="flex gap-2">
            <Input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add option..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
            />
            <Button type="button" onClick={handleAddOption}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {options.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {options.map((option, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  {option}
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={!question.questionText?.trim()}>
          <Save className="mr-2 h-4 w-4" />
          {isNew ? 'Add Question' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default TemplateManagement;
