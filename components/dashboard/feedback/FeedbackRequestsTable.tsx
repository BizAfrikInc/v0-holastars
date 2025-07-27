import {
  CheckCircle,
  Clock,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Users,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable, { TableColumn } from "@/components/ui/DataTable";
import { toast } from "@/hooks/use-toast";
import { FeedbackRequestWithTemplate } from "@/lib/db/schema/feedback-requests";
import { Customer } from "@/lib/db/schema/customers";
import FeedbackRecipientsDialog from "./FeedbackRecipientsDialog";

interface Props {
  customers: Customer[]
  requests: FeedbackRequestWithTemplate[]
  onSendRequest: (requestId: string) => Promise<{ successCount: number, failureCount: number }>
  updateFeedbackStatus: (requestId: string) => void
}

const FeedbackRequestsTable = ({ requests, onSendRequest, updateFeedbackStatus, customers }: Props) => {
  const [sendingIds, setSendingIds] = useState<string[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<FeedbackRequestWithTemplate | null>(null);

  const handleSend = async (requestId: string) => {
    const feedbackRequest = requests.find((r) => r.id === requestId);
    if (!feedbackRequest) return;
    setSendingIds(prev => [...prev, requestId]);
    try {
      const { successCount, failureCount } = await onSendRequest(requestId);
      const confirmationMsg = `${successCount} out of ${successCount + failureCount} ${feedbackRequest.channel}${feedbackRequest.customerIds.length > 1 ? 's' : ''} sent out successfully`;
      toast({
        title: "Success",
        description: confirmationMsg
      });
      updateFeedbackStatus(requestId);
    } catch {
      toast({
        title: "Error",
        description: `Failed to send out ${feedbackRequest.channel}s`,
        variant: "destructive"
      });
    } finally {
      setSendingIds(prev => prev.filter(id => id !== requestId));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'opened': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-50 text-green-700 border-green-200';
      case 'opened': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Phone className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const columns: TableColumn<FeedbackRequestWithTemplate>[] = [
    {
      key: 'template',
      label: 'Template',
      render: (request) => (
        <div>
          <p className="font-medium">{request.template?.name}</p>
          <p className="text-sm text-muted-foreground">
            {request.template?.questions.length} questions
          </p>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (request) => (
        <div className="flex items-center gap-2">
          {getChannelIcon(request.channel)}
          <Badge variant="outline" className="capitalize">
            {request.channel}
          </Badge>
        </div>
      )
    },
    {
      key: 'recipients',
      label: 'Recipients',
      render: (request) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{request.customerIds.length}</span>
          <span className="text-sm text-muted-foreground">
            {request.customerIds.length === 1 ? 'customer' : 'customers'}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (request) => (
        <Badge
          variant="outline"
          className={`${getStatusColor(request.status)} flex items-center gap-1 w-fit`}
        >
          {getStatusIcon(request.status)}
          {request.status}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (request) => (
        <div className="text-sm">
          {new Date(request.createdAt).toLocaleDateString()}
          <div className="text-xs text-muted-foreground">
            {new Date(request.createdAt).toLocaleTimeString()}
          </div>
        </div>
      )
    },
    {
      key: 'sentAt',
      label: 'Sent At',
      render: (request) => {
        if (!request.sentAt) return <span className="text-muted-foreground">Not sent</span>;
        return (
          <div className="text-sm">
            {new Date(request.sentAt).toLocaleDateString()}
            <div className="text-xs text-muted-foreground">
              {new Date(request.sentAt).toLocaleTimeString()}
            </div>
          </div>
        );
      }
    },
    {
      key: 'action',
      label: 'Actions',
      render: (request) => {
        const matchedCustomers = customers.filter(c => request.customerIds.includes(c.id));

        return request.status === 'pending' ? (
          <Button
            size="sm"
            onClick={() => handleSend(request.id)}
            disabled={sendingIds.includes(request.id)}
          >
            {sendingIds.includes(request.id) ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send
              </>
            )}
          </Button>
        ) : (
          <FeedbackRecipientsDialog customers={matchedCustomers} />
        );
      }
    }
  ];

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <Send className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No feedback requests</h3>
          <p className="text-muted-foreground mt-2">
            Create your first feedback request to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Feedback Requests ({requests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable<FeedbackRequestWithTemplate>
          data={requests}
          columns={columns}
          idKey="id"
          emptyMessage="No feedback requests found. Create feedback requests via the requests page"
          loadingMessage="Loading customers..."
        />
      </CardContent>
    </Card>
  );
};

export default FeedbackRequestsTable;