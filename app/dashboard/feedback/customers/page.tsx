"use client"
import { Download, Plus, Search, Upload } from "lucide-react";
import { useEffect, useState } from "react"
import AddCustomerModal from "@/components/dashboard/feedback/AddCustomerModal"
import CSVUploadModal from "@/components/dashboard/feedback/CSVUploadModal"
import CustomerTable from "@/components/dashboard/feedback/CustomerTable"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { CustomersApi } from "@/lib/api/customer"
import { Customer,NewCustomer } from "@/lib/db/schema/customers";
import { CreateCustomerRequest } from "@/lib/helpers/validation-types"
import { useAuthStore } from "@/store/authStore"
const FeedbackCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const {registeredBusiness} = useAuthStore()
  const [isLoading, setIsLoading] = useState(false);


  const fetchCustomers = async () => {
    try{
      setIsLoading(true);
      const {data: response} = await CustomersApi.fetchAll()
      if(!response.success || response.data.length === 0){
        toast({
          title: "Info",
          description: "No customers found",
        });
        return;
      }
      setCustomers(response.data)

    }catch{
      toast({
        title: "Error",
        description:" Something went wrong, try again later ",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchCustomers().then(r => r)
  },[]);

  const filteredCustomers = customers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    try{
      setIsLoading(true);
      const existingCustomer = customers.find(c => c.email === customerData.email);
      if (existingCustomer) {
        toast({
          title: "Error",
          description: "A customer with this email already exists.",
          variant: "destructive"
        });
        return;
      }

      if(!registeredBusiness?.id){
        toast({
          title: "Error",
          description: "A customer should be only be associated with a registered business",
          variant: "destructive"
        });
        return;
      }

      const payload: CreateCustomerRequest={
        businessId: registeredBusiness.id,
        customerName: customerData.customerName,
        email: customerData.email,
        phoneNumber: customerData.phoneNumber,
      }

      const {data: response} = await CustomersApi.singleCreate(payload)
      if(!response.success){
        toast({
          title: "Error",
          description: "Something went wrong, we could not add a customer",
          variant: "destructive"
        })
      }
      setCustomers(prev => [...prev, response.data]);
      toast({
        title: "Success",
        description: "Customer added successfully!"
      });
      setIsAddModalOpen(false);

    }catch{
      toast({
        title: "Error",
        description:" Something went wrong, try again later ",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCustomer = async (id: string, customerData: Partial<Customer>) => {
    try{
      setIsLoading(true);
      const { data: response} = await CustomersApi.update( customerData, id)
      if(!response.success){
        toast({
          title: "Error",
          description: "Something went wrong, we could not update customer",
          variant: "destructive"
        })
        return;
      }
      toast({
        title: "Success",
        description: "Customer updated successfully!"
      });
      setCustomers(prev => prev.map(customer =>
        customer.id === id ? { ...customer, ...customerData } : customer
      ));

    }catch{
      toast({
        title: "Error",
        description: "Something went wrong, try again later ",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
  try{
    setIsLoading(true);
    const { data: response} = await CustomersApi.delete(id)
    if(!response.success){
      toast({
        title: "Error",
        description: "Something went wrong, we could not delete customer",
        variant: "destructive"
      })
      return;
    }
    toast({
      title: "Success",
      description: "Customer deleted successfully!"
    });
    setCustomers(prev => prev.filter(customer => customer.id !== id));
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

  const handleMultiDeleteCustomers = async (ids: string[]) => {
    try {
      setIsLoading(true);
      await Promise.all(ids.map(async (id: string) => {
        await CustomersApi.delete(id)
      }))
      toast({
        title: "Success",
        description: `${ids.length} customer${ids.length === 1 ? '' : 's'} deleted successfully!`
      });
      setCustomers(prev => prev.filter(customer => !ids.includes(customer.id)));
    } catch(e){
      toast({
        title: "Error",
        description: "Something went wrong, we could not delete a customer",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }


  };

  const handleCSVUpload = async (csvData: NewCustomer[]) => {
    try{
      setIsLoading(true);
      if(!csvData.length){
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
      if(!registeredBusiness?.id) {
        toast({
          title: "Error",
          description: "A customer should be only be associated with a registered business",
          variant: "destructive"
        });
        return
      }

      const { data: response } = await CustomersApi.batchCreate(validCustomers.map(x=>({...x, businessId: registeredBusiness.id})))
      if(!response.success){
        toast({
          title: "Error",
          description: "Something went wrong, we could not add the uploaded list of customers",
          variant: "destructive"
        })
        return
      }

      setCustomers(prev => [...prev, ...response.data]);
      toast({
        title: "Success",
        description: `${validCustomers.length} customers added successfully!`
      });
      setIsCSVModalOpen(false);

    } catch{
      toast({
        title: "Error",
        description: "Something went wrong, try again later ",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSVTemplate = () => {
    const csvContent = "CustomerName,Email,PhoneNumber\nJohn Doe,john@example.com,+1234567890\nJane Smith,jane@example.com,+1987654321";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage customers for feedback collection</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={downloadCSVTemplate}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download CSV Template
          </Button>
          <Button
            onClick={() => setIsCSVModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload CSV
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
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
        </CardHeader>
        <CardContent>
          <CustomerTable
            customers={paginatedCustomers}
            onUpdate={handleUpdateCustomer}
            onDelete={handleDeleteCustomer}
            onMultiDelete={handleMultiDeleteCustomers}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredCustomers.length}
            itemsPerPage={itemsPerPage}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCustomer}
      />

      <CSVUploadModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onUpload={handleCSVUpload}
      />
    </div>
  );
};

export default FeedbackCustomers;