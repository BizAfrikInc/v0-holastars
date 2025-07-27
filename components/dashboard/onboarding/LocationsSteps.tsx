import { ArrowRight, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import LocationForm from "@/components/dashboard/LocationForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import { LocationsApi } from "@/lib/api/location"
import { Location } from "@/lib/helpers/types"
import { CreateLocationRequest } from "@/lib/helpers/validation-types"
import { useAuthStore } from "@/store/authStore"

interface LocationsStepProps {
  locations: Location[];
  onLocationAdded: (location: Location) => void;
  onNext: () => void;
  canProceed: boolean;
}

const LocationsStep = ({ locations, onLocationAdded, onNext, canProceed }: LocationsStepProps) => {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const {registeredBusiness} =  useAuthStore()
  
  const handleSubmit = async (data: Location) => {
    if(!registeredBusiness?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must have a registered business, for you to add a business location",
      });
      return;
    }

    const payload:CreateLocationRequest={
      businessId: registeredBusiness.id,
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
    }

    const {data: response}  = await LocationsApi.create(payload);
    if(!response.success){
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add a location successfully. Please try again later",
      });
      return;
    }
    
    onLocationAdded(response.data);
    setShowForm(false);
    toast({
      title: "Success",
      description: "Location added successfully",
    });
  };


  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Add Your Locations</h2>
        <p className="text-muted-foreground">
          Add at least one business location to continue
        </p>
      </div>

      {/* Locations List */}
      {locations.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">
            Added Locations ({locations.length})
          </h3>
          {locations.map((location, index) => (
            <div key={location.id} className="p-3 border rounded-lg bg-muted/50">
              <div className="font-medium">{location.name}</div>
              <div className="text-sm text-muted-foreground">{location.address}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add Location Form */}
      {showForm ? (
        <div className="border rounded-lg p-4">
          <LocationForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <Button
          onClick={() => setShowForm(true)}
          variant="outline"
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      )}

      {/* Continue Button */}
      {canProceed && (
        <Button
          onClick={onNext}
          className="w-full"
        >
          Continue to Departments
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}

      {locations.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          You need to add at least one location to continue
        </p>
      )}
    </div>
  );
};

export default LocationsStep;