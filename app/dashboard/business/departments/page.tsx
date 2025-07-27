"use client"
import { Plus } from "lucide-react";
import { useEffect, useState } from "react"
import DepartmentCard from "@/components/dashboard/DepartmentCard";
import DepartmentModal from "@/components/dashboard/DepartmentModal";
import DepartmentCardSkeleton from "@/components/skeletons/DepartmentCardSkeleton"
import { Button } from "@/components/ui/button";
import CustomAlert from "@/components/ui/CustomAlert"
import LoadingSpinner from "@/components/ui/LoaderSpinner"
import { useToast } from "@/hooks/use-toast";
import { DepartmentsApi } from "@/lib/api/department"
import { LocationsApi } from "@/lib/api/location"
import { Department, Location } from "@/lib/helpers/types"
import { CreateDepartmentRequest, UpdateDepartmentRequest } from "@/lib/helpers/validation-types"


const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | undefined>();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());



  const fetchLocations = async () => {
    try {
      const { data: response } = await LocationsApi.fetchAll()
      if(!response.success){
        setErrorMessage("Something went wrong fetching Locations")
        return;
      }
      setLocations(response.data);
    } catch {
      throw new  Error("Something went wrong fetching locations")
    }

  }


  const { toast } = useToast();

  const fetchDepartments = async () => {
    try {
      const { data: response } = await DepartmentsApi.fetchAll()
      if(!response.success){
        setErrorMessage("Something went wrong fetching departments")
        return;
      }
      setDepartments(response.data);
    } catch(e) {
      throw new Error("Something went wrong fetching departments")
    }

  }

  useEffect(() => {
    setLoading(true);

    Promise.allSettled([fetchDepartments(), fetchLocations()])
      .then((results) => {
        const [departmentsResult, locationsResult] = results;

        console.log(departmentsResult);

        if (departmentsResult.status === "rejected") {
          setErrorMessage("Failed to fetch departments");
        }

        if (locationsResult.status === "rejected") {
          setErrorMessage("Failed to fetch locations");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  console.log(errorMessage)


  const handleAddDepartment = async (data: Department) => {
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

    setDepartments(prev => [...prev, response.data]);
    toast({
      title: "Success",
      description: "Department added successfully",
    });
  };

  const handleEditDepartment = async (data: Department) => {
    if (!editingDepartment?.id) return;

    const  payload: UpdateDepartmentRequest = {
      name: data.name,
      description: data.description
    }

    const {data:response} =   await DepartmentsApi.update(payload,  editingDepartment.id)
    if(!response.success){
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update a Department information",
      })
      return;
    }


    setDepartments(prev =>
      prev.map(dept => dept.id === editingDepartment.id ? response.data : dept)
    );

    setEditingDepartment(undefined);
    toast({
      title: "Success",
      description: "Department updated successfully",
    });
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    setDeletingIds(prev => new Set(prev).add(departmentId));

    const {data: response} = await DepartmentsApi.delete(departmentId);
    if(!response.success){
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete location",
      })
      return;
    }
    setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
    toast({
      title: "Success",
      description: "Department deleted successfully",
    });
  };

  const openEditModal = (department: Department) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingDepartment(undefined);
    setIsModalOpen(true);
  };

  const getLocationById = (department: Department) => {
    if (!department?.locationId) return;
    return locations.find(loc => loc.id === department.locationId);
  };

  return (
      <div className="flex-1 p-6 space-y-6">
        {
          loading ? (<LoadingSpinner />) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Departments</h1>
                  <p className="text-muted-foreground">
                    Manage departments across your business locations
                  </p>
                </div>
                <Button onClick={openAddModal}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
              </div>

              {errorMessage ? (
                <CustomAlert
                  variant="error"
                  title="Error"
                  description={errorMessage}
                  closable={false}
                />
              ) : departments.length === 0 ? (        <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No departments yet</h3>
                  <p className="text-muted-foreground mb-4 max-w-sm">
                    Get started by adding your first department. Departments help organize your team and categorize reviews.
                  </p>
                  <Button onClick={openAddModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Department
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {departments.map((department) => {
                    const location = getLocationById(department);
                    return location ? (
                      <DepartmentCard
                        key={department.id}
                        department={department}
                        location={location}
                        onEdit={openEditModal}
                        onDelete={handleDeleteDepartment}
                      />
                    ) : null
                  })}
                  {Array.from(deletingIds).map((id) => (
                    <DepartmentCardSkeleton key={`skeleton-${id}`} />
                  ))}
                </div>
              )}

              <DepartmentModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                department={editingDepartment}
                locations={locations}
                onSubmit={editingDepartment ? handleEditDepartment : handleAddDepartment}
              />
            </>
          )
        }
    </div>
  );
};

export default Departments;