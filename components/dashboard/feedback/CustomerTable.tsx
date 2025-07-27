import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import ConfirmationModal from "@/components/ui/ConfirmationModal"
import DataPagination from "@/components/ui/DataPagination"
import DataTable, { TableAction, TableColumn } from "@/components/ui/DataTable"
import { Customer } from "@/lib/db/schema/customers"
import EditCustomerModal from "./EditCustomerModal";

interface CustomerTableProps {
  customers: Customer[];
  onUpdate?: (id: string, data: Partial<Customer>) => void;
  onDelete?: (id: string) => void;
  onMultiDelete?: (ids: string[]) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  isLoading: boolean;
  selectionMode?: boolean;
  selectedIds?: string[];
  onMultiSelect?: (customerIds: string[]) => void;
}

const CustomerTable = ({
  customers,
  onUpdate,
  onDelete,
  onMultiDelete,
  onMultiSelect,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  isLoading = false,
  selectionMode = false
}: CustomerTableProps) => {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
  };

  const handleDelete = (customer: Customer) => {
    setDeletingCustomer(customer);
  };

  const confirmDelete = () => {
    if (deletingCustomer && onDelete) {
      onDelete(deletingCustomer.id);
      setDeletingCustomer(null);
    }
  };

  const addSelectedCustomers = (customers: Customer[]) => {
    const ids = customers.map(customer => customer.id);
    if (onMultiSelect) {
      onMultiSelect(ids);
    }
  };

  const handleMultiDelete = (customers: Customer[]) => {
    const ids = customers.map(customer => customer.id);
     if(onMultiDelete) {
       onMultiDelete(ids);
     }
  };

  const columns: TableColumn<Customer>[] = [
    {
      key: 'customerName',
      label: 'Name',
      className: 'font-medium'
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (customer) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3" />
            {customer.email}
          </div>
          {customer.phoneNumber && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              {customer.phoneNumber}
            </div>
          )}
        </div>
      )
    },
  ];


  const actions: TableAction<Customer>[] = [];
  if(onUpdate){
    actions.push(    {
      type: 'edit',
      onClick: handleEdit,
      variant: 'ghost'
    },)
  }
  if (onDelete){
    actions.push(
      {
        type: 'delete',
        onClick: handleDelete,
        variant: 'ghost',
        className: 'text-destructive hover:text-destructive'
      },
    )
  }

  return (
    <div className="space-y-4">
      <DataTable<Customer>
        data={customers}
        columns={columns}
        actions={actions}
        onMultiDelete={handleMultiDelete}
        onMultiSelect={addSelectedCustomers}
        idKey="id"
        emptyMessage="No customers found. Add your first customer to get started."
        isLoading={isLoading}
        loadingMessage="Loading customers..."
        selectionMode={selectionMode}
      />

      {totalPages > 1 && (
        <DataPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}

      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          isOpen={!!editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onUpdate={(data) => {
            if (onUpdate) {
              onUpdate(editingCustomer.id, data);
              setEditingCustomer(null);
            }
          }}
        />
      )}

      <ConfirmationModal
        isOpen={!!deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        description={`Are you sure you want to delete "${deletingCustomer?.customerName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default CustomerTable;