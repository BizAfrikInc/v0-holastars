
'use client'
import { Building2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { BusinessApi } from "@/lib/api/business"
import { Business } from "@/lib/helpers/types"
import { CreateBusinessRequest } from "@/lib/helpers/validation-types"
import { useAuthStore } from "@/store/authStore";

interface BusinessFormData {
  name: string;
  email: string;
}

interface BusinessRegistrationFormProps {
  onComplete: (data: Business) => void;
  business?: Business;
  onNext?: () => void;
}

const BusinessRegistrationForm = ({ onComplete, business }: BusinessRegistrationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { authenticated, updateRegisteredBusiness, userRolesPermissions, updateUserRolesPermissions } = useAuthStore();

  const { isAuthenticated, loggedInUserEmail } = authenticated

  const form = useForm<BusinessFormData>({
    defaultValues: {
      name: business?.name ??  "",
      email: business?.email ?? ""
    }
  });

  const onSubmit = async (data: BusinessFormData) => {
    setIsLoading(true);

    try {
      if(!(isAuthenticated && loggedInUserEmail && userRolesPermissions?.id))  return
      
      const payload : CreateBusinessRequest = {
        ...data,
        userId: userRolesPermissions.id,
        email: loggedInUserEmail
      }
      
      const { data: response } = await BusinessApi.create(payload);
      if(!response.success) {
        toast({
          title: "Error: Registration Failed",
          description: "Business registration failed. Please try again later",
        })
        
      }

      const { business, role, permissions } = response.data

      const updatedUserRolesPermissions = {
        ... userRolesPermissions,
        roles: [...userRolesPermissions.roles, role],
        rolePermissions: [...userRolesPermissions.rolePermissions, ...permissions]
      }


      toast({
        title: "Business Registered Successfully!",
        description: "Your business has been registered and additional tools are now available.",
      });
      onComplete(response.data.business)
      updateRegisteredBusiness(business);
      updateUserRolesPermissions(updatedUserRolesPermissions);
    } catch (error) {
      console.error(error)
      toast({
        title: "Registration Failed",
        description: "There was an error registering your business. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
    <div className="text-center">
    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
    <Building2 className="h-6 w-6 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground">Register Your Business</h2>
  <p className="text-sm text-muted-foreground mt-2">
    Complete your business registration to unlock all features and tools
  </p>
  </div>

  <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
  <FormField
    control={form.control}
  name="name"
  rules={{
    required: "Business name is required",
      minLength: {
      value: 2,
        message: "Business name must be at least 2 characters"
    },
    maxLength: {
      value: 255,
        message: "Business name must not exceed 255 characters"
    }
  }}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Business Name *</FormLabel>
  <FormControl>
  <Input
    placeholder="Enter your business name"
  className="transition-all focus:scale-[1.02]"
    disabled={Boolean(business?.id)}
  {...field}
  />
  </FormControl>
  <FormMessage />
  </FormItem>
)}
  />

  <FormField
  control={form.control}
  name="email"
  rules={{
    required: "Business email is required",
      pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Please enter a valid email address"
    },
    maxLength: {
      value: 255,
        message: "Email must not exceed 255 characters"
    }
  }}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Business Email *</FormLabel>
  <FormControl>
  <Input
    disabled={Boolean(business?.id)}
    type="email"
  placeholder="business@example.com"
  className="transition-all focus:scale-[1.02]"
  {...field}
  />
  </FormControl>
  <FormMessage />
  </FormItem>
)}
  />

  <div className="pt-4">
  <Button
    type="submit"
  className="w-full"
  disabled={isLoading || Boolean(business?.id)}
    >
    {isLoading ? "Registering..." : "Register Business"}
    </Button>
    </div>
    </form>
    </Form>
    </div>
);
};

export default BusinessRegistrationForm;