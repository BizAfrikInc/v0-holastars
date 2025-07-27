'use client'
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/Logo";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api/auth"
import { ForgotPasswordRequest } from "@/lib/helpers/validation-types"


const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordRequest>({
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data: ForgotPasswordRequest) => {
    setIsLoading(true);

    if (!data.email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data: response } = await authApi.forgotPassword(data)

      if(!response.success) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive"
        });
        return
      }

      toast({
        title: "Success!",
        description: " We've sent you a password reset link. Please check your email to continue. If you don't receive an email, check your spam folder or try again later. If you continue to have issues, please contact support. ",
      });
      form.reset();

    } catch (error) {
      console.error('Error processing your forgot password request:', error);
      toast({
        title: "Error",
        description: "There was an error processing your forgot password request. Please try again.",
        variant: "destructive"
      });

    } finally {
      setIsLoading(false);
    }

  };

  if (emailSent) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-1">
            <Link href="/auth" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>

          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-600">
                Check Your Email
              </CardTitle>
              <CardDescription>
                We've sent password reset instructions to your email address.
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-6">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-primary hover:underline"
                >
                  try again
                </button>
              </p>

              <Link href="/auth">
                <Button variant="outline" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Link href="/auth" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </div>

        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-600">
              Forgot Password?
            </CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          className="transition-all focus:scale-[1.02]"
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
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Email"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/auth" className="text-primary hover:underline">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
