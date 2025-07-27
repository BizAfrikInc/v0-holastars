'use client'
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PasswordValidation from "@/components/auth/PasswordValidation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/Logo";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api/auth"
import { ResetPasswordRequest } from "@/lib/helpers/validation-types"

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname()
  const { toast } = useToast();

  const token = searchParams.get('token');
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Reset Link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive"
      });
      router.push('/auth/forgot-password');
    }
  }, [token, pathname, toast]);

  const form = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const password = form.watch("password");

  const passwordValidation = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    isValid: password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    const {confirmPassword, password} = data;

    if (!passwordValidation.isValid) {
      toast({
        title: "Invalid Password",
        description: "Please ensure your password meets all requirements.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please ensure both passwords are identical.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    const payload: ResetPasswordRequest = {
      token: token!,
      newPassword: password

    }

    try {
      const { data: response } = await authApi.resetPassword(payload)

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
        description: "Your password has been updated. You can now sign in with your new password. If you continue to have issues, please contact support. ",
      });
      form.reset();

    } catch (error) {
      console.error('Error resetting your password', error);
      toast({
        title: "Error",
        description: "There was an error resetting your password. Please try again.",
        variant: "destructive"
      });

    } finally {
      setIsLoading(false);
    }

  };

  if (!token) {
    return null;
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
              Reset Your Password
            </CardTitle>
            <CardDescription>
              Enter your new password below to complete the reset process.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            className="transition-all focus:scale-[1.02] pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <PasswordValidation password={password} validation={passwordValidation} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            className="transition-all focus:scale-[1.02] pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full btn-gradient"
                  disabled={isLoading || !passwordValidation.isValid}
                >
                  {isLoading ? "Updating Password..." : "Update Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
