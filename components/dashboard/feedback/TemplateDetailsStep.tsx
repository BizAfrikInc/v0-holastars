import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TemplateData } from "./CreateTemplateModal";

interface TemplateDetailsStepProps {
  data: TemplateData;
  onSubmit: (data: TemplateData) => void;
}

const TemplateDetailsStep = ({ data, onSubmit }: TemplateDetailsStepProps) => {
  const [formData, setFormData] = useState<TemplateData>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Template name is required";
    }

    if (formData.displayCompanyLogo && !formData.companyLogo?.trim()) {
      newErrors.companyLogo = "Company logo URL is required when display is enabled";
    }

    if (formData.displayCompanyStatement && !formData.companyStatement?.trim()) {
      newErrors.companyStatement = "Company statement is required when display is enabled";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      toast({
        title: "Template details saved",
        description: "Proceeding to add questions",
      });
    }
  };

  const updateFormData = <K extends keyof TemplateData>(field: K, value: TemplateData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide the basic details for your feedback template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="e.g., Customer Satisfaction Survey"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel">Channel</Label>
            <Select value={formData.channel} onValueChange={(value) => updateFormData('channel', value as "email" | "sms" | "whatsapp")}>
              <SelectTrigger>
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding Options</CardTitle>
          <CardDescription>
            Customize how your company appears in the template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="displayCompanyLogo">Display Company Logo</Label>
              <p className="text-sm text-muted-foreground">
                Show your company logo in the template
              </p>
            </div>
            <Switch
              id="displayCompanyLogo"
              checked={formData.displayCompanyLogo}
              onCheckedChange={(checked) => updateFormData('displayCompanyLogo', checked)}
            />
          </div>

          {formData.displayCompanyLogo && (
            <div className="space-y-2">
              <Label htmlFor="companyLogo">Company Logo URL *</Label>
              <Input
                id="companyLogo"
                value={formData.companyLogo || ''}
                onChange={(e) => updateFormData('companyLogo', e.target.value)}
                placeholder="https://example.com/logo.png"
                className={errors.companyLogo ? 'border-destructive' : ''}
              />
              {errors.companyLogo && (
                <p className="text-sm text-destructive">{errors.companyLogo}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="displayCompanyStatement">Display Company Statement</Label>
              <p className="text-sm text-muted-foreground">
                Show a custom message from your company
              </p>
            </div>
            <Switch
              id="displayCompanyStatement"
              checked={formData.displayCompanyStatement}
              onCheckedChange={(checked) => updateFormData('displayCompanyStatement', checked)}
            />
          </div>

          {formData.displayCompanyStatement && (
            <div className="space-y-2">
              <Label htmlFor="companyStatement">Company Statement *</Label>
              <Textarea
                id="companyStatement"
                value={formData.companyStatement || ''}
                onChange={(e) => updateFormData('companyStatement', e.target.value)}
                placeholder="e.g., We value your feedback and use it to improve our services."
                className={errors.companyStatement ? 'border-destructive' : ''}
                rows={3}
              />
              {errors.companyStatement && (
                <p className="text-sm text-destructive">{errors.companyStatement}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={!formData.name.trim()}>
          Continue to Questions
        </Button>
      </div>
    </form>
  );
};

export default TemplateDetailsStep;