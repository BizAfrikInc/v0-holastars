"use client"
import { Edit2, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import CreateTemplateModal from "@/components/dashboard/feedback/CreateTemplateModal"
import TemplatePreviewModal from "@/components/dashboard/feedback/TemplatePreviewModal"
import ViewTemplateModal from "@/components/dashboard/feedback/ViewTemplateModal"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmationModal from "@/components/ui/ConfirmationModal"
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FeedbackTemplatesApi } from "@/lib/api/template"
import { FeedbackTemplate, FeedbackTemplateWithQuestions } from "@/lib/db/schema/feedback-template"
import { CreateTemplateWithQuestionsDTO } from "@/lib/helpers/validation-types"


const FeedbackTemplates = () => {
  const [templates, setTemplates] = useState<FeedbackTemplateWithQuestions[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingTemplate, setViewingTemplate] = useState<FeedbackTemplateWithQuestions | null>(null);
  const [previewingTemplate, setPreviewingTemplate] = useState<FeedbackTemplateWithQuestions | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<FeedbackTemplate | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const { toast } = useToast();
  const router = useRouter()

  useEffect(() => {
    fetchTemplates().then(x=>x);
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {

      const { data: response } = await FeedbackTemplatesApi.fetchAll()
      if(!response.success){
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
        return;
      }

      setTemplates(response.data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = async (payload: CreateTemplateWithQuestionsDTO) => {
    try {

      const {data: response}  = await FeedbackTemplatesApi.create(payload);
      if(!response.success){
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
        return;
      }
      setTemplates(prev => [response.data, ...prev]);
      toast({
        title: "Success",
        description: "Template created successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const { data: response } = await FeedbackTemplatesApi.delete(templateId);
      if(!response.success){
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
        return;
      }
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
    setDeletingTemplate(null);
  };

  const handleBulkDelete = async () => {
    try {
      const toBeDeleted = selectedTemplates.map(templateId=> FeedbackTemplatesApi.delete(templateId));
      await Promise.all(toBeDeleted)
      setTemplates(prev => prev.filter(t => !selectedTemplates.includes(t.id)));
      setSelectedTemplates([]);
      toast({
        title: "Success",
        description: `${selectedTemplates.length} template(s) deleted successfully`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete templates",
        variant: "destructive",
      });
    }
    setShowBulkDeleteModal(false);
  };

  const handleManageTemplate = (templateId: string) => {
    router.push(`/dashboard/feedback/templates/${templateId}`);
  };

  const toggleTemplateSelection = (templateId: string) => {
    setSelectedTemplates(prev =>
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedTemplates(prev =>
      prev.length === filteredTemplates.length ? [] : filteredTemplates.map(t => t.id)
    );
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'sms': return 'bg-green-100 text-green-800';
      case 'whatsapp': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 p-9 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground">
            Create and manage feedback collection templates
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {selectedTemplates.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedTemplates.length} selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowBulkDeleteModal(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      {filteredTemplates.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={selectedTemplates.length === filteredTemplates.length}
            onChange={toggleSelectAll}
            className="rounded"
          />
          <span>Select all</span>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No templates found</h3>
            <p className="text-muted-foreground mt-2">
              {searchTerm
                ? "No templates match your search criteria."
                : "Get started by creating your first feedback template."
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateModal(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="relative group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20"
              onClick={() => setPreviewingTemplate(template)}
            >
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  onClick={(e)=>e.stopPropagation()}
                  checked={selectedTemplates.includes(template.id)}
                  onChange={(e) => {
                    toggleTemplateSelection(template.id);
                  }}
                  className="rounded"
                />
              </div>

              <CardHeader className="pl-12">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {template.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getChannelColor(template.channel as  string)}>
                        {template.channel}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {template.questions.length} questions
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {template.displayCompanyLogo && template.companyLogo && (
                  <div className="flex items-center gap-2">
                    <img
                      src={template.companyLogo}
                      alt="Company logo"
                      className="h-8 w-8 rounded object-cover"
                    />
                    <span className="text-sm text-muted-foreground">Company logo enabled</span>
                  </div>
                )}

                {template.displayCompanyStatement && template.companyStatement && (
                  <p className="text-sm text-muted-foreground italic line-clamp-2">
                    "{template.companyStatement}"
                  </p>
                )}

                <div className="pt-2">
                  <Badge variant="outline" className="text-xs">
                    Click to preview
                  </Badge>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Created {new Date(template.createdAt).toLocaleDateString()}
                </span>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingTemplate(template);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleManageTemplate(template.id)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingTemplate(template);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTemplate}
      />

      {viewingTemplate && (
        <ViewTemplateModal
          totalQuestions={viewingTemplate.questions.length}
          template={viewingTemplate}
          isOpen={!!viewingTemplate}
          onClose={() => setViewingTemplate(null)}
        />
      )}

      {previewingTemplate && (
        <TemplatePreviewModal
          questions={previewingTemplate.questions}
          template={previewingTemplate}
          isOpen={!!previewingTemplate}
          onClose={() => setPreviewingTemplate(null)}
          onManageTemplate={handleManageTemplate}
        />
      )}

      <ConfirmationModal
        isOpen={!!deletingTemplate}
        onClose={() => setDeletingTemplate(null)}
        onConfirm={() => deletingTemplate && handleDeleteTemplate(deletingTemplate.id)}
        title="Delete Template"
        description={`Are you sure you want to delete "${deletingTemplate?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      <ConfirmationModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={handleBulkDelete}
        title="Delete Templates"
        description={`Are you sure you want to delete ${selectedTemplates.length} template(s)? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default FeedbackTemplates;