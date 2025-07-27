'use client'
import { Eye, MessageSquare, Send, Users } from "lucide-react";
import { useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import BusinessRegistrationBanner from "@/components/dashboard/BusinessRegistrationBanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoaderSpinner"
import { useToast } from "@/hooks/use-toast"
import { authApi } from "@/lib/api/auth"
import { useAuthStore } from "@/store/authStore";
import { useOnboardingState } from "@/store/onBoardingStore"

const DashboardOverview = () => {

  const [hasMounted, setHasMounted] = useState(false)
  const [hasRegisteredBusiness, setHasRegisteredBusiness] = useState(false)
  const [loading, setLoading] = useState(false)
  const { authenticated, authorize, updateRegisteredBusiness, authenticate,  userRolesPermissions } = useAuthStore();
  const {onBoardingComplete} = useOnboardingState()
  const { toast } = useToast();

  const searchParams = useSearchParams()

  const googleSignInEmail = searchParams.get("token")

  const fetchUserRoleAndPermissions = async ()=> {
    try {
      setLoading(true)
      if(!( googleSignInEmail  ||  authenticated.loggedInUserEmail ) ) return null
      const { data: response } = await authApi.getUserRolesPermissions({ email: googleSignInEmail ?? authenticated.loggedInUserEmail!  })

      if (!response.success) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        return;
      }
      if(googleSignInEmail) authenticate(googleSignInEmail)
      authorize(response.data)
      if(response.data.registeredBusiness?.id){
        updateRegisteredBusiness(response.data.registeredBusiness)
        setHasRegisteredBusiness(true)
      }

    } catch (error) {
      console.error("Error retrieving user roles and permissions Please try again.", error);
      toast({
        title: "Error",
        description: "There was an error retrieving user roles and permissions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setHasMounted(true);
    fetchUserRoleAndPermissions().then(r => r)
  }, []);

  if (!hasMounted ||  !(googleSignInEmail || authenticated.loggedInUserEmail) ) {
    return null;
  }



  return (
    <>
      {
        loading ? <LoadingSpinner message="Setting up your dashboard ..."/> : (onBoardingComplete || hasRegisteredBusiness) ?
          (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Welcome back, {userRolesPermissions?.firstName}!
                    </h1>
                    <p className="text-muted-foreground">
                      Here's what's happening with your account today.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,247</div>
                        <p className="text-xs text-muted-foreground">
                          +18 new this month
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Feedback Requests</CardTitle>
                        <Send className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">89</div>
                        <p className="text-xs text-muted-foreground">
                          +12 sent this week
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Responses Received</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">63</div>
                        <p className="text-xs text-muted-foreground">
                          70% response rate
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Template Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-xs text-muted-foreground">
                          +24 since yesterday
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ): (<BusinessRegistrationBanner />)
      }
    </>
  );
};

export default DashboardOverview;