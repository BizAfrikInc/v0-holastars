
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Department, Location } from "@/lib/helpers/types"
import DepartmentForm from "./DepartmentForm";

interface DepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department;
  locations: Location[];
  onSubmit: (data: Department) => Promise<void>;
}

const DepartmentModal = ({
                           open,
                           onOpenChange,
                           department,
                           locations,
                           onSubmit
                         }: DepartmentModalProps) => {
  const handleSubmit = async (data: Department) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {department ? "Edit Department" : "Add New Department"}
          </DialogTitle>
        </DialogHeader>
        <DepartmentForm
          department={department}
          locations={locations}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentModal;