'use client'
import { Plus, Send } from "lucide-react";
import { useEffect, useState } from "react";
import FeedbackRequestsTable from "@/components/dashboard/feedback/FeedbackRequestsTable"
import FeedbackRequestWizard from "@/components/dashboard/feedback/FeedbackRequestWizard"
import LoadingSpinner from "@/components/ui/LoaderSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { CustomersApi } from "@/lib/api/customer";
import { mailingApi } from "@/lib/api/email"
import { FeedbackRequestApi } from "@/lib/api/feedback-request";
import { LocationsApi } from "@/lib/api/location";
import { FeedbackTemplatesApi } from "@/lib/api/template";
import { Customer } from "@/lib/db/schema/customers"
import { FeedbackRequestWithTemplate } from "@/lib/db/schema/feedback-requests";
import { FeedbackTemplateWithQuestions } from "@/lib/db/schema/feedback-template"
import { LocationWithDepartments } from "@/lib/db/schema/locations"
import { useAuthStore } from "@/store/authStore";
import { EmailRequest } from "@/lib/services/emails/zeptomail/types"

const FeedbackRequests = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [feedbackRequests, setFeedbackRequests] = useState<FeedbackRequestWithTemplate[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationsWithDepts, setLocationsWithDepts] = useState<LocationWithDepartments[]>([])
  const [templates, setTemplates] = useState<FeedbackTemplateWithQuestions[]>([]);
  const { registeredBusiness } = useAuthStore()


  const fetchCustomers = async () => {
    try {
      const { data: response } = await CustomersApi.fetchAll()
      if (!response.success || response.data.length === 0) {
        toast({
          title: "Info",
          description: "No customers found",
        });
        return;
      }
      setCustomers(response.data)
    } catch {
      toast({
        title: "Error",
        description: " Something went wrong, try again later ",
        variant: "destructive"
      })
    }
  }

  const fetchLocations = async () => {
    try {
      const { data: response } = await LocationsApi.fetchAllWithDepartments()
      if (!response.success) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive"
        })
        return;
      }
      setLocationsWithDepts(response.data);
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong fetching the locations",
        variant: "destructive"
      });

    }

  }

  const fetchTemplates = async () => {
    try {

      const { data: response } = await FeedbackTemplatesApi.fetchAll()
      if (!response.success) {
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
    }
  };

  const fetchFeedbackRequests = async () => {
    try {

      const { data: response } = await FeedbackRequestApi.fetchAll()
      if (!response.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
        return;
      }

      setFeedbackRequests(response.data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    Promise.all([
      fetchCustomers(),
      fetchLocations(),
      fetchTemplates(),
      fetchFeedbackRequests()
    ]).finally(() => (setIsLoading(false)))

  }, []);
  const businessId = registeredBusiness?.id;

  const handleWizardComplete = async (newRequest: FeedbackRequestWithTemplate) => {
    setFeedbackRequests(prev => [newRequest, ...prev]);
    setActiveTab("manage");
  };

  const handleSendRequest = async (requestId: string) => {
    const feedbackRequest = feedbackRequests.find((feedback) => feedback.id === requestId);
    if (!feedbackRequest) return {  successCount: 0, failureCount: customers.length};
    const recipientsPayload: EmailRequest[] = customers.filter(customer =>
      feedbackRequest.customerIds.includes(customer.id)).map(customer => ({
      type: 'template',
      mail_template_key: process.env.NEXT_PUBLIC_FEEDBACK_REQUESTS_TEMPLATE_KEY!,
      from:
        {
          "address": "info@holastars.com",
          "name": "Hola Stars"
        },
      to: [
        {
          email_address: {
            address: customer.email,
            name: customer.customerName,
          }
        }
      ],
      merge_info: {
        name: customer.customerName,
        feedbackLink: "https://www.google.com",
        supportEmail: "info@holastars.com",
        businessName: registeredBusiness?.name || "Holastars Reputation Management System",
        rewardDescription: "Get a chance to win a single item from your purchase list free of delivery",
        unsubscribeLink: "https://www.google.com",
      }
    }))

    const sentOutEmails = await Promise.allSettled(recipientsPayload.map(
      (payload) => mailingApi.send(payload)))

    const successes = sentOutEmails.filter((response) => response.status === "fulfilled")
    const failures = sentOutEmails.filter((response) => response.status === "rejected")

    return { successCount: successes.length, failureCount: failures.length };

  };

  const updateFeedbackStatus = async (requestId: string) => {
    const updatePayload = {
      status: "sent"  as const,
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const {data: response } =   await FeedbackRequestApi.update(updatePayload, requestId)
    if (!response.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.message,
      })
      return;
    }
    toast({
      title: "Success",
      description: "Feedback Request successfully resolved as sent",
    })
    setFeedbackRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? { ...request, status: 'sent' as const, sentAt: response.data.sentAt, updatedAt: response.data.updatedAt }
          : request
      )
    );
  };

  const updateCustomers = (customers: Customer[])=>{
   setCustomers(prev=>([...customers, ...prev,]))

  }

  return (
    <div className="flex-1 p-9 space-y-6">
      {
        isLoading ? (
          <LoadingSpinner message="Setting up your feedback requests pre-requisites" />
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold">Feedback Requests</h1>
              <p className="text-muted-foreground">Create and manage feedback requests for your customers</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Request
                </TabsTrigger>
                <TabsTrigger value="manage" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Manage Requests ({feedbackRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-6">
                <FeedbackRequestWizard
                  onComplete={handleWizardComplete}
                  customers={customers}
                  updateCustomers={updateCustomers}
                  templates={templates}
                  locations={locationsWithDepts.length > 0 ? locationsWithDepts.map((x) => x.location) : []}
                  departments={locationsWithDepts.length > 0 ? locationsWithDepts.flatMap((x) => x.departments) : []}
                  businessId={businessId}
                />
              </TabsContent>

              <TabsContent value="manage" className="space-y-6">
                <FeedbackRequestsTable
                  requests={feedbackRequests}
                  onSendRequest={handleSendRequest}
                  updateFeedbackStatus={updateFeedbackStatus}
                  customers={customers}
                />
              </TabsContent>
            </Tabs>
          </>
        )
      }
    </div>
  );
};

export default FeedbackRequests;