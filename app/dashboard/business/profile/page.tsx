"use client"
import {  Eye, EyeOff, Loader2, Lock, Shield } from "lucide-react"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PasswordValidation from "@/components/auth/PasswordValidation"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { BusinessApi } from "@/lib/api/business"
import { UsersApi } from "@/lib/api/user"
import { ResetPasswordRequest } from "@/lib/helpers/validation-types"
import { useAuthStore } from "@/store/authStore";

interface BusinessFormData {
  businessName: string;
  businessEmail: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage = () => {
  const { authenticated, userRolesPermissions, registeredBusiness, updateRegisteredBusiness } = useAuthStore();
  const {toast} =useToast()

  if (!authenticated.isAuthenticated) return null;
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [updatingBusinessDetails, setUpdatingBusinessDetails] = useState<boolean>(false);
  const [updatingUserPassword, setUpdatingUserPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const businessForm = useForm<BusinessFormData>({
    defaultValues: {
      businessName: registeredBusiness?.name || "",
      businessEmail: registeredBusiness?.email || "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const password = passwordForm.watch("newPassword");

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



  const onBusinessSubmit = async (data: BusinessFormData) => {
    try {
      if(!registeredBusiness?.id ) return
      setUpdatingBusinessDetails(true);
      const { data: response } = await BusinessApi.update({ name: data.businessName, email: data.businessEmail }, registeredBusiness.id)
      if(!response.success) {
        toast({
          title: "Error",
          description: "Your business information could not be updated. Please try again.",
          variant: "destructive",
        });
        return
      }
      toast({
        title: "Business Updated",
        description: "Your business information has been successfully updated.",
      });

      updateRegisteredBusiness({...registeredBusiness, name: data.businessName, email: data.businessEmail});
    }catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Something went wrong while updating your business information. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setUpdatingBusinessDetails(false);
    }
  };


  const onPasswordSubmit = async (data: PasswordFormData) => {
    if(!userRolesPermissions?.id) return
    setUpdatingUserPassword(true);

    const {confirmPassword} = data;

    if (!passwordValidation.isValid) {
      toast({
        title: "Invalid Password",
        description: "Please ensure your password meets all requirements.",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please ensure both passwords are identical.",
        variant: "destructive"
      });
      return;
    }

    const payload: ResetPasswordRequest = {
      newPassword: password

    }

    try {
      const { data: response } = await UsersApi.resetPassword(payload, userRolesPermissions?.id)

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
      passwordForm.reset();
      setIsPasswordDialogOpen(false);

    } catch (error) {
      console.error('Error resetting your password', error);
      toast({
        title: "Error",
        description: "There was an error resetting your password. Please try again.",
        variant: "destructive"
      });

    } finally {
      setUpdatingUserPassword(false);
    }

  };


  return (
    <div className="flex-1 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Profile</h1>
        <p className="text-muted-foreground">
          Manage your business account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Update your business details and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...businessForm}>
              <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-4">
                <FormField
                  control={businessForm.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your business name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={businessForm.control}
                  name="businessEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="business@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <Button type="submit" disabled={updatingBusinessDetails}>
                  {updatingBusinessDetails && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {updatingBusinessDetails ? "Updating..." : "Update Business Information"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Update your password and security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and choose a new one.
                  </DialogDescription>
                </DialogHeader>
                <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
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
                    control={passwordForm.control}
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
                    disabled={updatingUserPassword || !passwordValidation.isValid}
                  >
                    {updatingUserPassword ? "Updating Password..." : "Update Password"}
                  </Button>
                </form>
              </Form>
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Enable Two-Factor Authentication
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;