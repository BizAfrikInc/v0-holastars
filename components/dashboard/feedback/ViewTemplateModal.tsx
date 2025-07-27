
import { Calendar, Mail, MessageSquare, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FeedbackTemplate } from "@/lib/db/schema/feedback-template"

interface ViewTemplateModalProps {
  template: FeedbackTemplate;
  isOpen: boolean;
  onClose: () => void;
  totalQuestions:  number
}

const ViewTemplateModal = ({ template, isOpen, onClose, totalQuestions }: ViewTemplateModalProps) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getChannelIcon(template.channel as string)}
            {template.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Channel</h4>
                  <Badge className={getChannelColor(template.channel as string)}>
                    {getChannelIcon(template.channel as string)}
                    <span className="ml-1 capitalize">{template.channel}</span>
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Questions</h4>
                  <p className="font-medium">{totalQuestions} question{totalQuestions === 1 ? '' : 's'}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Branding Configuration</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Company Logo</span>
                    <Badge variant={template.displayCompanyLogo ? "default" : "secondary"}>
                      {template.displayCompanyLogo ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>

                  {template.displayCompanyLogo && template.companyLogo && (
                    <Card className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={template.companyLogo}
                          alt="Company logo"
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">Logo Preview</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {template.companyLogo}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Company Statement</span>
                    <Badge variant={template.displayCompanyStatement ? "default" : "secondary"}>
                      {template.displayCompanyStatement ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>

                  {template.displayCompanyStatement && template.companyStatement && (
                    <Card className="p-3">
                      <p className="text-sm italic">"{template.companyStatement}"</p>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Created</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(template.createdAt.toString())}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-muted-foreground">
                  {  template.updatedAt && formatDate(template.updatedAt.toString())}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  Template Ready for Use
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                  This template can be used to collect feedback from customers via {template.channel}.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTemplateModal;