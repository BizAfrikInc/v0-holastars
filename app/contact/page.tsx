'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Mail, MapPin ,Phone} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mailingApi } from "@/lib/api/email"
import { EmailRequest } from "@/lib/services/emails/zeptomail/types"

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().optional(),
  phone: z.string().optional(),
  subject: z.string().min(1, { message: "Please select a subject" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters long" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      const contactUsPayload: EmailRequest = {
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
        mail_template_key: process.env.NEXT_PUBLIC_CONTACT_US_TEMPLATE_KEY!,
        merge_info: {
          name: data.name,
          phone: data.phone || "Not provided",
          email: data.email,
          company: data.company || "Not provided",
          subject: data.subject,
          message: data.message,

        }

      }

      const contactUsAckPayload: EmailRequest = {
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
        mail_template_key: process.env.NEXT_PUBLIC_CONTACT_US_ACK_TEMPLATE_KEY!,
        merge_info: {
          name: data.name,
          phone: data.phone || "Not provided",
          email: data.email,
          company: data.company || "Not provided",
          subject: data.subject,
          message: data.message,

        }

      }

      const payloads = [contactUsPayload,contactUsAckPayload];
      const promises = payloads.map((payload)=>mailingApi.send(payload));
      const response = await Promise.all(promises);
      const success = response.length > 0

      if (!success) {
        toast.error("There was an error sending your email and adding you to the waitlist. Please try again.");
        return;
      }

      setIsSuccess(true);
      toast.success("Message sent successfully!");
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-holastars-light to-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="mb-6">Get in <span className="hero-gradient-text">Touch</span></h1>
            <p className="text-lg text-gray-700 mb-6">
              Have questions or want to learn more about Hola Stars? Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            <div>
              <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-holastars-primary/10 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-holastars-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-gray-600">info@holastars.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-holastars-primary/10 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-holastars-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-gray-600">(+254) 750 873 424</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg border border-gray-100 mb-8">
                <h3 className="font-semibold text-lg mb-4">Schedule a Demo</h3>
                <p className="text-gray-600 mb-4">
                  Want to see Hola Stars in action? Schedule a personalized demo with our product specialists.
                </p>
                <Button className="btn-gradient">Book a Demo</Button>
              </div>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  {isSuccess ? (
                    <div className="text-center py-8">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
                      <p className="text-gray-600 mb-6">
                        Your message has been sent successfully. We'll get back to you as soon as possible.
                      </p>
                      <Button
                        onClick={() => setIsSuccess(false)}
                        className="btn-gradient"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name*</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
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
                                <FormLabel>Email Address*</FormLabel>
                                <FormControl>
                                  <Input placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your company" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="(555) 123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject*</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a subject" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">General Inquiry</SelectItem>
                                  <SelectItem value="sales">Sales Question</SelectItem>
                                  <SelectItem value="support">Technical Support</SelectItem>
                                  <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message*</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="How can we help you?"
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full btn-gradient"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-holastars-light">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Find quick answers to our most common questions. If you don't see what you're looking for, just reach out to us.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Map and Office Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="mb-4">Visit Our Office</h2>
            <p className="text-gray-600">
              We'd love to meet you in person at our headquarters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <MapPin className="text-holastars-primary mr-3 mt-1 flex-shrink-0" size={50} />
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-semibold mb-4">Hola Stars Headquarters</h3>
              <p className="text-gray-600 mb-6">
                JK Avenue<br />
                Suite 002<br />
                Opp KCB Bank<br />
                KENYA
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-holastars-primary" />
                  <span>info@holastars.com</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-holastars-primary" />
                  <span>(+254) 750 873 424</span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-2">Business Hours</h4>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 5:00 PM (EAT)<br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

// FAQs
const faqs = [
  {
    question: "How quickly can I start collecting reviews?",
    answer: "You can start collecting reviews immediately after setting up your account. Our onboarding process typically takes less than 30 minutes, and you'll be able to send your first review requests right away."
  },
  {
    question: "Do you integrate with my CRM or POS system?",
    answer: "Yes! Hola Stars integrates with many popular CRM and POS systems including Salesforce, HubSpot, Shopify, and many others. We also offer an API for custom integrations with your existing systems."
  },
  {
    question: "Can I use Hola Stars for multiple business locations?",
    answer: "Absolutely. Our Premium, Enterprise, and Agency plans all support multiple locations with specific controls and permissions for each location. This makes Hola Stars perfect for franchises and businesses with multiple branches."
  },
  {
    question: "How does the white label option work?",
    answer: "With our white label option, you can customize the platform with your own branding, including your logo, colors, and domain name. This is perfect for agencies and businesses that want to offer reputation management under their own brand."
  },
  {
    question: "Is there a long-term contract?",
    answer: "No, all our plans are available on a month-to-month basis, though you can save 10% by paying annually. You can cancel at any time without penalty."
  },
  {
    question: "How do you handle negative reviews?",
    answer: "Hola Stars gives you tools to handle negative feedback effectively. Our system can be configured to alert you immediately when negative feedback comes in, allowing you to respond quickly and address concerns before they become public reviews."
  },
];

export default Contact;
