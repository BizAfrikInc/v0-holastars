
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Location } from "@/lib/helpers/types"
import LocationForm from "./LocationForm";


interface LocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location?: Location;
  onSubmit: (data: Location) => Promise<void>;
}

const LocationModal = ({ open, onOpenChange, location, onSubmit }: LocationModalProps) => {
  const handleSubmit = async (data: Location) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {location ? "Edit Location" : "Add New Location"}
          </DialogTitle>
        </DialogHeader>
        <LocationForm
          location={location}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;