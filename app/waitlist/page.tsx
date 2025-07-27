'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CheckCircle, Loader2, Mail, Phone, User } from "lucide-react";
import Link from "next/link"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {  z } from "zod"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mailingApi } from "@/lib/api/email"
import { EmailRequest } from "@/lib/services/emails/zeptomail/types"

const waitlistFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().optional(),
  phone: z.string().optional(),
  service: z.string().min(1, { message: "Please select a service" }),
  honeypot: z.string().optional() // Anti-spam measure
});

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

const Waitlist = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      service: "",
      honeypot: ""
    },
  });


  const onSubmit = async (data: WaitlistFormValues) => {
    // Check honeypot (if filled, likely a bot)
    if (data.honeypot) {
      // Silently reject but pretend to accept
      setSubmitted(true);
      return;
    }

    setLoading(true);

    try {
      const waitlistPayload: EmailRequest = {
        type: 'template',
        to: [
          {
            email_address: {
              address:process.env.NEXT_PUBLIC_SYSTEM_EMAIL_RECIPIENT_EMAIL!,
              name: process.env.NEXT_PUBLIC_SYSTEM_EMAIL_RECIPIENT_NAME,
            }
          }],
        from: {
          address: process.env.NEXT_PUBLIC_SYSTEM_EMAIL!,
          name: "Hola Stars"
        },
        mail_template_key: process.env.NEXT_PUBLIC_JOIN_WAITLIST_TEMPLATE_KEY!,
        merge_info: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          company: data.company,
          service: data.service,
        }

      }
      const acknowledgementWaitlistPayload: EmailRequest = {
        type: 'template',
        to: [
          {
            email_address: {
              address:data.email,
              name: data.name,
            }
          }],
        from: {
          address: process.env.NEXT_PUBLIC_SYSTEM_EMAIL!,
          name: "Hola Stars"
        },
        mail_template_key: process.env.NEXT_PUBLIC_JOIN_WAITLIST_ACK_TEMPLATE_KEY!,
        merge_info: {
          name: data.name,
        }

      }
      const payloads = [waitlistPayload,acknowledgementWaitlistPayload];
      const promises = payloads.map((payload)=>mailingApi.send(payload));
      const response = await Promise.all(promises);
      const success = response.length === 2
      if (!success) {
        toast.error("There was an error sending your email and adding you to the waitlist. Please try again.");
        return;
      }

      // Show success message
      toast.success("You've been added to our waitlist. We'll be in touch soon!");

      // Reset the form
      form.reset();
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-brand-light to-blue-50 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl hero-gradient-text">Join Our Waitlist</h1>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
              Be the first to know when we launch our revolutionary reputation management platform.
            </p>
          </div>

          <div className="w-full max-w-md mt-6">
            {submitted ? (
              <Card className="backdrop-blur-sm bg-white/70 shadow-lg hover-card-effect border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl text-center hero-gradient-text">Thank You!</CardTitle>
                  <CardDescription className="text-center text-base">You've been added to our waitlist!</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 pb-6">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-r from-brand to-brand-dark flex items-center justify-center shadow-md">
                      <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                    <p className="text-center text-gray-600 max-w-xs">
                      We'll notify you as soon as we launch. In the meantime, follow us on social media for updates!
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pt-2">
                  <Button asChild variant="outline" className="rounded-full px-8 hover:bg-brand-light hover:text-brand-dark transition-all">
                    <Link href="/">Return to Homepage</Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="backdrop-blur-sm bg-white/70 shadow-lg hover-card-effect border-none">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl text-center hero-gradient-text">Sign Up</CardTitle>
                      <CardDescription className="text-center">Enter your details to join our waitlist.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700">
                              <User className="h-4 w-4 text-brand" />
                              Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Jane Doe"
                                className="pl-3 focus-visible:ring-brand transition-all border-gray-200"
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
                            <FormLabel className="flex items-center gap-2 text-gray-700">
                              <Mail className="h-4 w-4 text-brand" />
                              Email Address <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="you@example.com"
                                type="email"
                                className="pl-3 focus-visible:ring-brand transition-all border-gray-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700">
                              <Building2 className="h-4 w-4 text-brand" />
                              Company Name <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your Company"
                                className="pl-3 focus-visible:ring-brand transition-all border-gray-200"
                                {...field}
                              />
                            </FormControl>
                            <p className="text-xs text-gray-500 mt-1 pl-1">
                              Let us know the name of your business or organization
                            </p>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700">
                              <Phone className="h-4 w-4 text-brand" />
                              Phone Number <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(123) 456-7890"
                                type="tel"
                                className="pl-3 focus-visible:ring-brand transition-all border-gray-200"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700">
                              Service Interest <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="focus-visible:ring-brand transition-all border-gray-200">
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Hola Stars Reputation Monitoring and Review Management"> Reputation Monitoring and Review Management</SelectItem>
                                <SelectItem value="Hola Stars Affiliate Program">Affiliate Program</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="honeypot"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="(123) 456-7890"
                                type="tel"
                                className="hidden"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                    </CardContent>
                    <CardFooter className="pt-2 pb-6">
                      <Button
                        type="submit"
                        className="w-full rounded-full btn-gradient py-6 text-base font-medium"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Join Waitlist
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
