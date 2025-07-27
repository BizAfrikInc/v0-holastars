'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, Mail, Star } from "lucide-react"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "sonner"
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { sendEmail } from "@/lib/services/emails/send-email"

// Define form schema with Zod
const waitlistSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  businessName: z.string().optional(),
  phoneNumber: z.string().optional(),
  name: z.string(),

});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

interface ComingSoonHeroProps {
  targetDate: Date;
}

const ComingSoonHero: React.FC<ComingSoonHeroProps> = ({ targetDate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);



  // Define the form
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: '',
      email: '',
      businessName: '',
      phoneNumber: '',
    },
  });

  // EmailJS configuration
  const templateId = process.env.NEXT_PUBLIC_WAITLIST_EMAILJS_TEMPLATE_ID;

  const onSubmit = async (data: WaitlistFormValues) => {
    setIsSubmitting(true);

    try {

      const templateParams = {
        from_email: data.email,
        from_name: data.name || 'Not provided',
        from_business_name: data.businessName || "Not provided",
        from_phone: data.phoneNumber || "Not provided",
      };

      if (!templateId) {
        toast.error("Email template ID is not defined");
        return;
      }

      const success = await sendEmail(templateParams, templateId);
      if (!success) {
        toast.error("There was an error sending your email and adding you to the waitlist. Please try again.");
        return;
      }
      // Show success message
      toast.success("You've been added to our waitlist. We'll be in touch soon!");

      // Reset the form
      form.reset();
    } catch (error) {
      console.error('Error submitting waitlist form:', error);
      toast.error("There was an error adding you to the waitlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-gradient-to-b from-purple-100 to-white">
      <div className="relative z-10 container max-w-4xl mx-auto space-y-8">
        {/* Headline & Subheadline */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-sky-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Building Reputation, One Feedback at a Time
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Hola Stars is launching soon – the ultimate platform for reviews, feedback, and business growth.
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <CountdownTimer targetDate={targetDate} className="mb-8" />
        </motion.div>

        {/* Email Capture Form */}
        <motion.div
          id="#waitlist-form"
          className="max-w-md mx-auto w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Your email address"
                          type="email"
                          className="h-12 shadow-sm border-purple-200 focus:border-purple-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="btn btn-primary cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Join Waitlist
                  </>
                )}
              </Button>
            </form>
          </Form>
        </motion.div>

        {/* Coming Soon Badge */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-sky-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Coming Soon
          </div>
        </motion.div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="white">
          <path d="M0,96L80,80C160,64,320,32,480,21.3C640,11,800,21,960,26.7C1120,32,1280,32,1440,37.3L1440,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default ComingSoonHero;
