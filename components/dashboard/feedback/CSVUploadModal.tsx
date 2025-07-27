import { AlertCircle, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewCustomer } from "@/lib/db/schema/customers"
import { useAuthStore } from "@/store/authStore"



interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (customers: NewCustomer[]) => void;
}

const CSVUploadModal = ({ isOpen, onClose, onUpload }: CSVUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { registeredBusiness } = useAuthStore()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please select a valid CSV file');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const parseCSV = (csvText: string): NewCustomer[] => {
    if (!registeredBusiness?.id) return [];
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header and one data row');
    }

    const headers = lines[0]?.split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['customername', 'email'];

    const missingHeaders = requiredHeaders.filter(header =>
      !headers?.some(h => h.includes(header))
    );

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    const customers: NewCustomer[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i]?.split(',').map(v => v.trim().replace(/"/g, '')) ?? [];

      if (values.length < 2) continue; // Skip incomplete rows

      const customer: NewCustomer = {
        customerName: '',
        email: '',
        businessId: registeredBusiness?.id

      };

      headers?.forEach((header, index) => {
        const value = values[index]?.trim();
        if (!value) return;

        if (header.includes('customername') || header.includes('name')) {
          customer.customerName = value;
        } else if (header.includes('email')) {
          customer.email = value;
        } else if (header.includes('phone')) {
          customer.phoneNumber = value;
        }
      });

      if (customer.customerName && customer.email && !customers.find(x => x.email === customer.email)) {
        customers.push(customer);
      }
    }

    return customers;
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const customers = parseCSV(text);


      if (customers.length === 0) {
        throw new Error('No valid customers found in CSV file');
      }

      onUpload(customers);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Customers CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="csv-file"
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a CSV file with CustomerName and Email columns
            </p>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{file.name}</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted/50 p-3 rounded text-sm">
            <p className="font-medium mb-2">CSV Format Requirements:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Required: CustomerName, Email</li>
              <li>• Optional: PhoneNumber, Location, Department</li>
              <li>• First row should contain headers</li>
              <li>• Use commas to separate values</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVUploadModal;