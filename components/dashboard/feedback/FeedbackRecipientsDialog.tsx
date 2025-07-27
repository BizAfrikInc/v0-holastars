import { Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

interface Customer {
    id: string;
    businessId: string;
    customerName: string;
    email: string;
    phoneNumber: string | null;
    status: "active" | "inactive";
    createdAt: Date;
    updatedAt: Date;
}

interface Props {
    customers: Customer[];
}

const FeedbackRecipientsDialog = ({ customers }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Feedback Recipients</DialogTitle>
                    <DialogDescription>
                        Customer details for this feedback request.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 max-h-[300px] overflow-y-auto mt-4">
                    {customers.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No matching customers found.</p>
                    ) : (
                        customers.map((customer) => (
                            <div
                                key={customer.id}
                                className="text-sm border rounded-md p-3 shadow-sm bg-muted/20"
                            >
                                <p className="font-medium text-primary">{customer.customerName}</p>
                                <p className="text-muted-foreground">{customer.email}</p>
                                {customer.phoneNumber && (
                                    <p className="text-muted-foreground text-xs">📞 {customer.phoneNumber}</p>
                                )}
                                <p className="text-xs mt-1 italic text-muted-foreground">
                                    Status: {customer.status}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FeedbackRecipientsDialog;
  