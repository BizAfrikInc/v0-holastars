"use client"
import { Edit2, GripVertical, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TemplateQuestion } from "./CreateTemplateModal";

interface TemplateQuestionsStepProps {
  questions: TemplateQuestion[];
  onSubmit: (questions: TemplateQuestion[]) => void;
}

const TemplateQuestionsStep = ({ questions, onSubmit }: TemplateQuestionsStepProps) => {
  const [questionsList, setQuestionsList] = useState<TemplateQuestion[]>(questions);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<TemplateQuestion>>({
    questionText: '',
    inputFieldType: 'input',
    isRequired: false,
    options: []
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setQuestionsList(questions);
  }, [questions]);

  const generateId = () => Date.now().toString();

  const handleAddQuestion = () => {
    if (!newQuestion.questionText?.trim()) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive",
      });
      return;
    }

    const isDuplicate = questionsList.some(q =>
      q.questionText.toLowerCase() === newQuestion.questionText?.toLowerCase()
    );

    if (isDuplicate) {
      toast({
        title: "Error",
        description: "This question already exists",
        variant: "destructive",
      });
      return;
    }

    const question: TemplateQuestion = {
      identifier: generateId(),
      questionText: newQuestion.questionText!,
      inputFieldType: newQuestion.inputFieldType || 'input',
      isRequired: newQuestion.isRequired || false,
      options: ['radio', 'checkbox'].includes(newQuestion.inputFieldType || '')
        ? newQuestion.options || []
        : undefined
    };

    setQuestionsList(prev => [...prev, question]);
    setNewQuestion({
      questionText: '',
      inputFieldType: 'input',
      isRequired: false,
      options: []
    });
    setShowAddForm(false);

    toast({
      title: "Success",
      description: "Question added successfully",
    });
  };

  const handleUpdateQuestion = (identifier: string, updatedQuestion: Partial<TemplateQuestion>) => {
    setQuestionsList(prev => prev.map(q =>
      q.identifier === identifier ? { ...q, ...updatedQuestion } : q
    ));
    setEditingQuestion(null);

    toast({
      title: "Success",
      description: "Question updated successfully",
    });
  };

  const handleDeleteQuestion = (uuid: string) => {
    setQuestionsList(prev => prev.filter(q => q.identifier !== uuid));
    toast({
      title: "Success",
      description: "Question deleted successfully",
    });
  };

  const handleSubmit = () => {
    if (questionsList.length === 0) {
      toast({
        title: "Error",
        description: "At least one question is required",
        variant: "destructive",
      });
      return;
    }

    onSubmit(questionsList);
    toast({
      title: "Questions saved",
      description: "Proceeding to review",
    });
  };

  function swap<T>(arr: T[], i: number, j: number): T[] {
    if (i < 0 || j < 0 || i >= arr.length || j >= arr.length) return arr;

    const copy = [...arr];
    const tempI = copy[i] as T;
    const tempJ = copy[j] as T;

    copy[i] = tempJ;
    copy[j] = tempI;

    return copy;
  }

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newList = swap(questionsList,index,newIndex);
    setQuestionsList(newList);
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
      <Card>
        <CardHeader>
          <CardTitle>Template Questions</CardTitle>
          <CardDescription>
            Add questions that will be presented to your customers. You can reorder them by dragging.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questionsList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No questions added yet</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {questionsList.map((question, index) => (
                <Card key={question.identifier} className="relative">
                  <CardContent className="pt-6">
                    {editingQuestion === question.identifier ? (
                      <EditQuestionForm
                        question={question}
                        onSave={(updatedQuestion) => handleUpdateQuestion(question.identifier, updatedQuestion)}
                        onCancel={() => setEditingQuestion(null)}
                      />
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col gap-1 mt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveQuestion(index, 'up')}
                            disabled={index === 0}
                            className="h-6 w-6 p-0"
                          >
                            <GripVertical className="h-3 w-3" />
                          </Button>
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
                                onClick={() => setEditingQuestion(question.identifier)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteQuestion(question.identifier)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Badge variant="secondary">
                              {getFieldTypeLabel(question.inputFieldType)}
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
                    )}
                  </CardContent>
                </Card>
              ))}

              {!showAddForm && (
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(true)}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Question
                </Button>
              )}
            </div>
          )}

          {showAddForm && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Add New Question</CardTitle>
              </CardHeader>
              <CardContent>
                <AddQuestionForm
                  question={newQuestion}
                  onChange={setNewQuestion}
                  onSave={handleAddQuestion}
                  onCancel={() => setShowAddForm(false)}
                />
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={questionsList.length === 0}
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
};

const AddQuestionForm = ({ question, onChange, onSave, onCancel }: {
  question: Partial<TemplateQuestion>;
  onChange: (question: Partial<TemplateQuestion>) => void;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const [options, setOptions] = useState<string[]>(question.options || []);
  const [newOption, setNewOption] = useState('');

  const needsOptions = ['radio', 'checkbox'].includes(question.inputFieldType || '');

  // Update the parent component whenever options change
  useEffect(() => {
    if (needsOptions) {
      onChange({ ...question, options });
    }
  }, [options, needsOptions]);

  // Reset options when input type changes
  useEffect(() => {
    if (!needsOptions) {
      setOptions([]);
      onChange({ ...question, options: [] });
    }
  }, [question.inputFieldType]);

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      const updatedOptions = [...options, newOption.trim()];
      setOptions(updatedOptions);
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question Text *</Label>
        <Textarea
          value={question.questionText || ''}
          onChange={(e) => onChange({ ...question, questionText: e.target.value })}
          placeholder="Enter your question here..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Input Type</Label>
          <Select
            value={question.inputFieldType || 'input'}
            onValueChange={(value) => onChange({ ...question, inputFieldType: value as 'input' | 'textarea' | 'radio' | 'checkbox' })}
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
            onCheckedChange={(checked) => onChange({ ...question, isRequired: checked })}
          />
        </div>
      </div>

      {needsOptions && (
        <div className="space-y-3">
          <Label>Options {needsOptions && <span className="text-red-500">*</span>}</Label>
          <div className="flex gap-2">
            <Input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add option..."
              onKeyPress={handleKeyPress}
            />
            <Button
              type="button"
              onClick={handleAddOption}
              disabled={!newOption.trim() || options.includes(newOption.trim())}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {options.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Added options:</p>
              <div className="flex flex-wrap gap-2">
                {options.map((option, index) => (
                  <Badge key={index} variant="secondary" className="pr-1">
                    {option}
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {needsOptions && options.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Please add at least one option for {question.inputFieldType === 'radio' ? 'single' : 'multiple'} choice questions.
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={
            !question.questionText?.trim() ||
            (needsOptions && options.length === 0)
          }
        >
          <Save className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>
    </div>
  );
};

const EditQuestionForm = ({ question, onSave, onCancel }: {
  question: TemplateQuestion;
  onSave: (question: Partial<TemplateQuestion>) => void;
  onCancel: () => void;
}) => {
  const [editedQuestion, setEditedQuestion] = useState(question);
  const [options, setOptions] = useState<string[]>(question.options || []);
  const [newOption, setNewOption] = useState('');

  const needsOptions = ['radio', 'checkbox'].includes(editedQuestion.inputFieldType);

  // Update the edited question whenever options change
  useEffect(() => {
    setEditedQuestion(prev => ({
      ...prev,
      options: needsOptions ? options : undefined
    }));
  }, [options, needsOptions]);

  // Reset options when input type changes
  useEffect(() => {
    if (!needsOptions) {
      setOptions([]);
    }
  }, [editedQuestion.inputFieldType]);

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions(prev => [...prev, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question Text *</Label>
        <Textarea
          value={editedQuestion.questionText}
          onChange={(e) => setEditedQuestion({ ...editedQuestion, questionText: e.target.value })}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Input Type</Label>
          <Select
            value={editedQuestion.inputFieldType}
            onValueChange={(value) => setEditedQuestion({ ...editedQuestion, inputFieldType: value as 'input' | 'textarea' | 'radio' | 'checkbox' })}
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
            checked={editedQuestion.isRequired}
            onCheckedChange={(checked) => setEditedQuestion({ ...editedQuestion, isRequired: checked })}
          />
        </div>
      </div>

      {needsOptions && (
        <div className="space-y-3">
          <Label>Options {needsOptions && <span className="text-red-500">*</span>}</Label>
          <div className="flex gap-2">
            <Input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add option..."
              onKeyPress={handleKeyPress}
            />
            <Button
              type="button"
              onClick={handleAddOption}
              disabled={!newOption.trim() || options.includes(newOption.trim())}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {options.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Added options:</p>
              <div className="flex flex-wrap gap-2">
                {options.map((option, index) => (
                  <Badge key={index} variant="secondary" className="pr-1">
                    {option}
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(editedQuestion)}
          disabled={
            !editedQuestion.questionText?.trim() ||
            (needsOptions && options.length === 0)
          }
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default TemplateQuestionsStep;
