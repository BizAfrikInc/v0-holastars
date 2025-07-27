import { ArrowRight, Plus, Users } from "lucide-react";
import { useState } from "react";
import DepartmentForm from "@/components/dashboard/DepartmentForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import { DepartmentsApi } from "@/lib/api/department"
import { Department, Location } from "@/lib/helpers/types"
import { CreateDepartmentRequest } from "@/lib/helpers/validation-types"

interface DepartmentsStepProps {
  departments: Department[];
  locations: Location[];
  onDepartmentAdded: (department: Department) => void;
  onNext: () => void;
  onSkip: () => void;
}

const DepartmentsStep = ({
                           departments,
                           locations,
                           onDepartmentAdded,
                           onNext,
                           onSkip
                         }: DepartmentsStepProps) => {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();


  const handleSubmit = async (data: Department) => {
    if(!data?.locationId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "A department must  be associated to a Location",
      });
      return;
    }
    const payload: CreateDepartmentRequest =  {
      name: data.name,
      locationId: data.locationId,
      description: data.description
    }
    const {data: response}  = await DepartmentsApi.create(payload);
    if(!response.success){
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create a department successfully. Please try again later",
      });
      return;
    }

    onDepartmentAdded(response.data);
    setShowForm(false);
    toast({
      title: "Success",
      description: "Department added successfully",
    });
  };

    const getLocationName = (department: Department) => {
    if(!department.locationId) return "Unknown  Location" ;
    const location = locations.find(loc => loc.id === loc.id);
    return location?.name || "Unknown Location";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Add Departments (Optional)</h2>
        <p className="text-muted-foreground">
          Organize your business by adding departments to your locations
        </p>
      </div>

      {/* Departments List */}
      {departments.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">
            Added Departments ({departments.length})
          </h3>
          {departments.map((department) => (
            <div key={department.id} className="p-3 border rounded-lg bg-muted/50">
              <div className="font-medium">{department.name}</div>
              <div className="text-sm text-muted-foreground">
                {getLocationName(department)}
              </div>
              {department.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {department.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Department Form */}
      {showForm ? (
        <div className="border rounded-lg p-4">
          <DepartmentForm
            locations={locations}
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
          Add Department
        </Button>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onSkip}
          variant="outline"
          className="flex-1"
        >
          Skip This Step
        </Button>
        <Button
          onClick={onNext}
          className="flex-1"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DepartmentsStep;