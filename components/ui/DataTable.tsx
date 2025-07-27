import { Edit2, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmationModal from "@/components/ui/ConfirmationModal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableAction<T> {
  type: 'edit' | 'delete' | 'custom';
  icon?: React.ReactNode;
  label?: string;
  onClick: (item: T) => void;
  className?: string;
  variant?: "ghost" | "outline" | "destructive" | "default" | "secondary" | "link";
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  onMultiDelete?: (items: T[]) => void;
  onMultiSelect?: (items: T[]) => void;
  idKey: keyof T;
  emptyMessage?: string;
  className?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  selectionMode?: boolean;
}

const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  actions = [],
  onMultiDelete,
  idKey,
  emptyMessage = "No data found.",
  className,
  isLoading = false,
  loadingMessage = "Loading...",
  selectionMode = false,
  onMultiSelect
}: DataTableProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? [...data] : []);
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, item]);
    } else {
      setSelectedItems(prev => prev.filter(selected => selected[idKey] !== item[idKey]));
    }
  };

  const handleMultiDelete = () => {
    if (onMultiDelete && selectedItems.length > 0) {
      onMultiDelete(selectedItems);
      setSelectedItems([]);
    }
    setShowDeleteConfirm(false);
  };

  const addToSelection = () => {
    if (onMultiSelect && selectedItems.length > 0) {
      onMultiSelect(selectedItems);
    }
  };

  const isSelected = (item: T) => selectedItems.some(selected => selected[idKey] === item[idKey]);
  const isAllSelected = data.length > 0 && selectedItems.length === data.length;

  return (
    <div className={className}>
      {
        selectionMode ? (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4">
            <span className="text-sm text-muted-foreground">
              {selectedItems.length} item{selectedItems.length === 1 ? '' : 's'} selected
            </span>
            <Button
              variant="default"
              disabled={selectedItems.length === 0}
              size="sm"
              onClick={addToSelection}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add  To Recipient List
            </Button>
          </div>
        ) :
          (
            onMultiDelete && selectedItems.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4">
                <span className="text-sm text-muted-foreground">
                  {selectedItems.length} item{selectedItems.length === 1 ? '' : 's'} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            )
          )
      }

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-md">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">{loadingMessage}</span>
            </div>
          </div>
        )}

        <div className={`rounded-md border transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          <Table >
            <TableHeader>
              <TableRow>
                {onMultiDelete && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      disabled={isLoading}
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead key={String(column.key)} className={column.headerClassName}>
                    {column.label}
                  </TableHead>
                ))}
                {actions.length > 0 && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (onMultiDelete ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="text-center text-muted-foreground py-8">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={String(item[idKey])}>
                    {onMultiDelete && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected(item)}
                          onCheckedChange={(checked) => handleSelectItem(item, checked as boolean)}
                          disabled={isLoading}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={String(column.key)} className={column.className}>
                        {column.render ? column.render(item) : String(item[column.key] || '')}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {actions.map((action, index) => (
                            <Button
                              key={index}
                              variant={action.variant || "ghost"}
                              size="sm"
                              onClick={() => action.onClick(item)}
                              className={action.className}
                              disabled={isLoading}
                            >
                              {action.icon || (action.type === 'edit' ? <Edit2 className="h-4 w-4" /> : action.type === 'delete' ? <Trash2 className="h-4 w-4" /> : null)}
                              {action.label && <span className="ml-1">{action.label}</span>}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleMultiDelete}
        title="Delete Selected Items"
        description={`Are you sure you want to delete ${selectedItems.length} item${selectedItems.length === 1 ? '' : 's'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default DataTable;
