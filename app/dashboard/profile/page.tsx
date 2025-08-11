"use client"
import { Camera, Eye, EyeOff, Loader2, Lock, Shield } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import PasswordValidation from "@/components/auth/PasswordValidation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { BusinessApi } from "@/lib/api/business"
import { UsersApi } from "@/lib/api/user"
import type { ResetPasswordRequest } from "@/lib/helpers/validation-types"
import { useAuthStore } from "@/store/authStore"
import SocialMediaConnections from "@/components/dashboard/SocialMediaConnections"

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
}

interface BusinessFormData {
  businessName: string
  businessEmail: string
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [updatingUserDetails, setUpdatingUserDetails] = useState<boolean>(false)
  const [updatingBusinessDetails, setUpdatingUBusinessDetails] = useState<boolean>(false)
  const [updatingUserPassword, setUpdatingUserPassword] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    authenticated,
    userRolesPermissions,
    registeredBusiness,
    updateUserRolesPermissions,
    updateRegisteredBusiness,
  } = useAuthStore()
  const { toast } = useToast()

  if (!authenticated.isAuthenticated) return null

  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      firstName: userRolesPermissions?.firstName || "",
      lastName: userRolesPermissions?.lastName || "",
      email: userRolesPermissions?.email || "",
    },
  })

  const businessForm = useForm<BusinessFormData>({
    defaultValues: {
      businessName: registeredBusiness?.name || "",
      businessEmail: registeredBusiness?.email || "",
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const password = passwordForm.watch("newPassword")

  const passwordValidation = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    isValid:
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      if (!userRolesPermissions?.id) return
      setUpdatingUserDetails(true)
      const { data: response } = await UsersApi.update({ ...data, image: profileImage }, userRolesPermissions.id)
      if (!response.success) {
        toast({
          title: "Error",
          description: "Your profile information could  not be updated. Please try again.",
          variant: "destructive",
        })
        return
      }
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      })

      updateUserRolesPermissions({ ...userRolesPermissions, ...data })
    } catch (e) {
      console.log(e)
      toast({
        title: "Error",
        description: "Something went wrong while updating your profile. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setUpdatingUserDetails(false)
    }
  }

  const onBusinessSubmit = async (data: BusinessFormData) => {
    try {
      if (!registeredBusiness?.id) return
      setUpdatingUBusinessDetails(true)
      const { data: response } = await BusinessApi.update(
        { name: data.businessName, email: data.businessEmail },
        registeredBusiness.id,
      )
      if (!response.success) {
        toast({
          title: "Error",
          description: "Your business information could not be updated. Please try again.",
          variant: "destructive",
        })
        return
      }
      toast({
        title: "Business Updated",
        description: "Your business information has been successfully updated.",
      })

      updateRegisteredBusiness({ ...registeredBusiness, name: data.businessName, email: data.businessEmail })
    } catch (e) {
      console.log(e)
      toast({
        title: "Error",
        description: "Something went wrong while updating your business information. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setUpdatingUBusinessDetails(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (!userRolesPermissions?.id) return
    setUpdatingUserPassword(true)

    const { confirmPassword } = data

    if (!passwordValidation.isValid) {
      toast({
        title: "Invalid Password",
        description: "Please ensure your password meets all requirements.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please ensure both passwords are identical.",
        variant: "destructive",
      })
      return
    }

    const payload: ResetPasswordRequest = {
      newPassword: password,
    }

    try {
      const { data: response } = await UsersApi.resetPassword(payload, userRolesPermissions?.id)

      if (!response.success) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success!",
        description:
          "Your password has been updated. You can now sign in with your new password. If you continue to have issues, please contact support. ",
      })
      passwordForm.reset()
      setIsPasswordDialogOpen(false)
    } catch (error) {
      console.error("Error resetting your password", error)
      toast({
        title: "Error",
        description: "There was an error resetting your password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingUserPassword(false)
    }
  }

  const triggerImageUpload = () => {
    document.getElementById("avatar-upload")?.click()
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and profile picture.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                {/* Profile Image Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    {profileImage ? (
                      <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile" />
                    ) : (
                      userRolesPermissions?.firstName &&
                      userRolesPermissions?.lastName && (
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                          {getInitials(userRolesPermissions?.firstName, userRolesPermissions?.lastName)}
                        </AvatarFallback>
                      )
                    )}
                  </Avatar>
                  <div className="space-y-2">
                    <Button type="button" variant="outline" onClick={triggerImageUpload}>
                      <Camera className="mr-2 h-4 w-4" />
                      Change Avatar
                    </Button>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={updatingUserDetails}>
                  {updatingUserDetails && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {updatingUserDetails ? "Updating..." : "Update User Information"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Update your business details and contact information.</CardDescription>
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
            <CardDescription>Update your password and security settings.</CardDescription>
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
                  <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
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

        <SocialMediaConnections />
      </div>
    </div>
  )
}

export default ProfilePage
