import {
  Building,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Send,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { CustomersApi } from "@/lib/api/customer";
import { FeedbackRequestApi } from "@/lib/api/feedback-request";
import { Customer, NewCustomer } from "@/lib/db/schema/customers"
import { Department } from "@/lib/db/schema/departments";
import { FeedbackRequestWithTemplate, NewFeedbackRequest } from "@/lib/db/schema/feedback-requests";
import { FeedbackTemplateWithQuestions } from "@/lib/db/schema/feedback-template"
import { Location } from "@/lib/db/schema/locations";
import { CreateFeedbackRequestDTO } from "@/lib/helpers/validation-types";
import { useAuthStore } from "@/store/authStore";
import CSVUploadModal from "./CSVUploadModal";
import CustomerTable from "./CustomerTable";
import TemplatePreviewModal from "./TemplatePreviewModal";


interface Props {
  onComplete: (data: FeedbackRequestWithTemplate) => void;
  updateCustomers: (customers: Customer[]) => void;
  customers: Customer[];
  templates: FeedbackTemplateWithQuestions[];
  locations: Location[];
  departments: Department[];
  businessId?: string;
}

const FeedbackRequestWizard = ({ onComplete, customers, updateCustomers, templates, locations, departments, businessId }: Props) => {
  const { userRolesPermissions } = useAuthStore()
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<NewFeedbackRequest>({
    channel: "email",
    templateId: templates[0]?.id ?? "",
    customerIds: [],
    businessId: "",
    locationId: null,
    departmentId: null,
    requesterId: userRolesPermissions?.id ?? ""
  });
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [previewingTemplate, setPreviewingTemplate] = useState<FeedbackTemplateWithQuestions | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage] = useState(5);



  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const channels = [
    { id: 'email' as const, name: 'Email', icon: Mail, description: 'Send feedback requests via email' },
    { id: 'sms' as const, name: 'SMS', icon: Phone, description: 'Send feedback requests via SMS' },
    { id: 'whatsapp' as const, name: 'WhatsApp', icon: MessageSquare, description: 'Send feedback requests via WhatsApp' }
  ];

  const availableTemplates = templates.filter(template =>
    !data.channel || template.channel === data.channel
  );

  const selectedTemplate = templates.find(t => t.id === data.templateId);
  const allCustomers = [...customers];
  const selectedCustomers = allCustomers.filter(c => data.customerIds?.includes(c.id));

  const selectedLocation = locations.find(l => l.id === data.locationId);
  const availableDepartments = departments.filter(d => d.locationId === data.locationId);
  const selectedDepartment = departments.find(d => d.id === data.departmentId);
  const filteredCustomers = allCustomers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);


  



  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.channel !== null;
      case 2: return data.templateId !== null;
      case 3: return (data.customerIds ?? []).length > 0;
      case 4: return true; // Location/Department step - always optional
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChannelSelect = (channel: 'email' | 'sms' | 'whatsapp') => {
    setData(prev => ({
      ...prev,
      channel,
      templateId: "" // Reset template when channel changes
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    setData(prev => ({ ...prev, templateId }));
  };
  const handleLocationSelect = (locationId: string | null) => {
    setData(prev => ({
      ...prev,
      locationId,
      departmentId: null // Reset department when location changes
    }));
  };

  const handleDepartmentSelect = (departmentId: string | null) => {
    setData(prev => ({ ...prev, departmentId }));
  };

  const handleCustomerSelect = (customerIds: string[]) => {
    setData(prev => ({
      ...prev,
      customerIds: Array.from(new Set([...(prev.customerIds ?? []), ...customerIds]))
    }));
    handleNext();
  };


  const handleCSVUpload = async (csvData: NewCustomer[]) => {
    try {

      setIsLoading(true);
      if (!csvData.length) {
        toast({
          title: "Error",
          description: "No valid users to upload",
          variant: "destructive"
        })
        return;
      }

      const duplicates = csvData.filter(newCustomer =>
        customers.some(existing => existing.email === newCustomer.email)
      );


      if (duplicates.length > 0) {
        toast({
          title: "Warning",
          description: `${duplicates.length} customers with duplicate emails were skipped.`,
          variant: "destructive"
        });
      }

      const validCustomers = csvData.filter(newCustomer =>
        !customers.some(existing => existing.email === newCustomer.email)
      );
      if (!businessId) {
        toast({
          title: "Error",
          description: "A customer should be only be associated with a registered business",
          variant: "destructive"
        });
        return
      }
      if (validCustomers.length === 0) {
        toast({
          title: "Error",
          description: "No valid customers to upload",
          variant: "destructive"
        });
        return;
      }

      const { data: response } = await CustomersApi.batchCreate(validCustomers.map(x => ({ ...x, businessId })))
      if (!response.success) {
        toast({
          title: "Error",
          description: "Something went wrong, we could not add the uploaded list of customers",
          variant: "destructive"
        })
        return
      }
      const newCustomers = response.data as Customer[]

      setData(prev => ({
        ...prev,
        customerIds: [...newCustomers.map(c => c.id), ...(prev.customerIds ?? []), ],
      }));

      toast({
        title: "Success",
        description: `${validCustomers.length} customers added successfully!`
      });
      updateCustomers(newCustomers);
      setIsCSVModalOpen(false);

    } catch {
      toast({
        title: "Error",
        description: "Something went wrong, try again later ",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      if (!businessId || !selectedCustomers.length || !data.templateId) {
        toast({
          title: "Error",
          description: 'Kindly ensure all required entities are provided (Business, Customers(recipients), Template)'
        })
        return
      }
      const payload: CreateFeedbackRequestDTO = {
        businessId,
        templateId: data.templateId,
        requesterId: data.requesterId,
        locationId: data.locationId,
        channel: data.channel,
        customerIds: selectedCustomers.map(customer => customer.id)
      }

      const { data: response } = await FeedbackRequestApi.create(payload);
      if (!response.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create a feedback request. Please try again later",
        });
        return;
      }
      onComplete(response.data);
      toast({
        title: "Success",
        description: `Feedback request created and will be sent to ${selectedCustomers.length} customers`
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create feedback request",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleManageTemplate = (templateId: string) => {
    router.push(`/dashboard/feedback/templates/${templateId}`);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Choose Feedback Channel</h2>
              <p className="text-muted-foreground">Select how you want to send feedback requests to your customers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {channels.map((channel) => (
                <Card
                  key={channel.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${data.channel === channel.id ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                  onClick={() => handleChannelSelect(channel.id)}
                >
                  <CardContent className="p-6 text-center">
                    <channel.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-medium mb-2">{channel.name}</h3>
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Select Feedback Template</h2>
              <p className="text-muted-foreground">
                Choose a template for your {data.channel} feedback requests
              </p>
            </div>

            {availableTemplates.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No templates available</h3>
                <p className="text-muted-foreground">
                  No {data.channel} templates found. Please create a template first.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${data.templateId === template.id ? 'ring-2 ring-primary border-primary' : ''
                      }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="capitalize">
                              {template.channel}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {template.questions.length} questions
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewingTemplate(template);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {template.displayCompanyStatement && template.companyStatement && (
                        <p className="text-sm text-muted-foreground italic">
                          "{template.companyStatement}"
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Select Recipients</h2>
                <p className="text-muted-foreground">Choose customers to receive feedback requests</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsCSVModalOpen(true)}
              >
                Upload CSV
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <CustomerTable
              customers={paginatedCustomers}
              onMultiSelect={handleCustomerSelect}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={allCustomers.length}
              itemsPerPage={allCustomers.length}
              selectedIds={data.customerIds}
              selectionMode={true}
              isLoading={isLoading}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Location & Department (Optional)</h2>
              <p className="text-muted-foreground">Select a specific location and department for this feedback request</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Select Location (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant={data.locationId === null ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleLocationSelect(null)}
                    >
                      All Locations
                    </Button>
                    {locations.map((location) => (
                      <Button
                        key={location.id}
                        variant={data.locationId === location.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleLocationSelect(location.id)}
                      >
                        {location.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Select Department (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!data.locationId ? (
                    <p className="text-sm text-muted-foreground">Select a location first to see departments</p>
                  ) : availableDepartments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No departments found for this location</p>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        variant={data.departmentId === null ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleDepartmentSelect(null)}
                      >
                        All Departments
                      </Button>
                      {availableDepartments.map((department) => (
                        <Button
                          key={department.id}
                          variant={data.departmentId === department.id ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => handleDepartmentSelect(department.id)}
                        >
                          {department.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Review & Preview</h2>
              <p className="text-muted-foreground">Review your feedback request before creating</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    {data.channel === 'email' && <Mail className="h-4 w-4" />}
                    {data.channel === 'sms' && <Phone className="h-4 w-4" />}
                    {data.channel === 'whatsapp' && <MessageSquare className="h-4 w-4" />}
                    Feedback Channel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="capitalize">
                    {data.channel}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Template
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-medium">{selectedTemplate?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplate?.questions.length} questions
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Recipients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="text-lg font-semibold">{selectedCustomers.length}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCustomers.length === 1 ? 'customer' : 'customers'} selected
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {(data.locationId || data.departmentId) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location & Department
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-medium">
                      Location: {selectedLocation?.name || 'All Locations'}
                    </p>
                    <p className="font-medium">
                      Department: {selectedDepartment?.name || 'All Departments'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Selected Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium">{customer.customerName}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Feedback Request Created!</h2>
              <p className="text-muted-foreground">
                Your feedback request has been created successfully and is ready to be sent to {selectedCustomers.length} customers.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Feedback Request</h1>
          <Badge variant="outline">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <Card>
        <CardContent className="p-6">{renderStep()}</CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {currentStep < 5 && (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {currentStep === 5 && (
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? (
                "Creating..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Create Request
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <CSVUploadModal isOpen={isCSVModalOpen} onClose={() => setIsCSVModalOpen(false)} onUpload={handleCSVUpload} />

      {previewingTemplate && (
        <TemplatePreviewModal
          questions={previewingTemplate.questions}
          template={previewingTemplate}
          isOpen={!!previewingTemplate}
          onClose={() => setPreviewingTemplate(null)}
          onManageTemplate={handleManageTemplate}
        />
      )}
    </div>
  )
};

export default FeedbackRequestWizard;