
"use client"
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import LocationCard from "@/components/dashboard/LocationCard";
import LocationModal from "@/components/dashboard/LocationModal";
import LocationCardSkeleton from "@/components/skeletons/LocationCardSkeleton"
import { Button } from "@/components/ui/button";
import CustomAlert from "@/components/ui/CustomAlert"
import LoadingSpinner from "@/components/ui/LoaderSpinner"
import { useToast } from "@/hooks/use-toast";
import { LocationsApi } from "@/lib/api/location"
import { Location } from "@/lib/helpers/types"
import { CreateLocationRequest, UpdateLocationRequest } from "@/lib/helpers/validation-types"
import { useAuthStore } from "@/store/authStore"

const Locations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchingLocations, setFetchingLocations] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<Location | undefined>();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { toast } = useToast();
  const {registeredBusiness} =  useAuthStore()

  useEffect(() => {
    fetchLocations().then(x=>x)
  },[])

  const fetchLocations = async () => {
    try {
      setFetchingLocations(true);
      const { data: response } = await LocationsApi.fetchAll()
      if(!response.success){
        setErrorMessage(response.message)
        return;
      }
      setLocations(response.data);
    } catch{
      setErrorMessage("Something went  wrong  fetching the locations")

    } finally {
      setFetchingLocations(false);
    }

  }

  const handleAddLocation = async (data: Location) => {
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


    setLocations(prev => [...prev, response.data]);
    toast({
      title: "Success",
      description: "Location added successfully",
    });
  };

  const handleEditLocation = async (data: Location) => {
    if (!editingLocation?.id) return;

  const payload: UpdateLocationRequest = {
    name: data.name,
    phoneNumber: data.phoneNumber,
    email: data.email,
    address: data.address,
  }

  const {data:response} =   await LocationsApi.update(payload,  editingLocation.id)
    if(!response.success){
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update location",
      })
      return;
    }

    setLocations(prev =>
      prev.map(loc => loc.id === editingLocation.id ? response.data : loc)
    );

    setEditingLocation(undefined);
    toast({
      title: "Success",
      description: "Location updated successfully",
    });
  };

  const handleDeleteLocation = async (locationId: string) => {
    setDeletingIds(prev => new Set(prev).add(locationId));

    const {data: response} = await LocationsApi.delete(locationId);
    if(!response.success){
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete location",
      })
      return;
    }
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
    toast({
      title: "Success",
      description: "Location deleted successfully",
    });
  };

  const openEditModal = (location: Location) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingLocation(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {
        fetchingLocations ? (<LoadingSpinner/>): (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Locations</h1>
                <p className="text-muted-foreground">
                  Manage your business locations
                </p>
              </div>
              <Button onClick={openAddModal}>
                <Plus className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </div>

            {errorMessage ? (
              <CustomAlert
                variant="error"
                title="Error"
                description={errorMessage}
                closable={false}
              />
            ) : locations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No locations yet</h3>
                <p className="text-muted-foreground mb-4 max-w-sm">
                  Get started by adding your first business location. Each location can have its own departments and reviews.
                </p>
                <Button onClick={openAddModal}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Location
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    onEdit={openEditModal}
                    onDelete={handleDeleteLocation}
                  />
                ))}
                {Array.from(deletingIds).map((id) => (
                  <LocationCardSkeleton key={`skeleton-${id}`} />
                ))}
              </div>
            )}

            <LocationModal
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
              location={editingLocation}
              onSubmit={editingLocation ? handleEditLocation : handleAddLocation}
            />
          </>
        )
      }

    </div>
  );
};

export default Locations;