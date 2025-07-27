
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Location } from "@/lib/helpers/types"
const locationSchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().min(1).max(500),
  phoneNumber: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
});


type LocationFormData = z.infer<typeof locationSchema >;

interface LocationFormProps {
  location?: Location;
  onSubmit: (data: LocationFormData) => Promise<void>;
  onCancel: () => void;
}

const LocationForm = ({ location, onSubmit, onCancel }: LocationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: null,
      email: null
    },
  })

  useEffect(() => {
    if (location) {
      form.reset({
        name: location.name,
        address: location.address,
        phoneNumber: location.phoneNumber,
        email: location.email,
      });
    }
  }, [location, form]);

  const handleSubmit = async (data: LocationFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter location name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter full address"
                  className="min-h-[80px]"
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter email"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number </FormLabel>
              <FormControl>
                <Input placeholder="Enter your  phone number" {...field} value={field.value ?? ""}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {location ? "Updating..." : "Creating..."}
              </>
            ) : (
              location ? "Update Location" : "Create Location"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LocationForm;