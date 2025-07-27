'use client'
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/ui/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api/auth"

const EmailVerification = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const searchParams= useSearchParams();
  const pathname = usePathname();
  const { toast } = useToast();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Verification Link",
        description: "This email verification link is invalid or has expired.",
        variant: "destructive"
      });
      setVerificationError(true);
      setIsVerifying(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const { data: response } = await authApi.emailVerification(token)
        if(!response.success) {
          toast({
            title: "Error",
            description: response.message,
            variant: "destructive"
          });
          return
        }

        setVerificationSuccess(true);
        toast({
          title: "Email Verified Successfully!",
          description: "Your email address has been verified. You can now sign in to your account.",
        });
      } catch (error) {
        console.error('Error processing your email verification request:', error);
        setVerificationError(true);
        toast({
          title: "Verification Failed",
          description: "We couldn't verify your email address. Please try again or contact support.",
          variant: "destructive"
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, pathname ,toast]);

  if (isVerifying) {
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
                Verifying Your Email
              </CardTitle>
              <CardDescription>
                Please wait while we verify your email address...
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (verificationSuccess) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-600">
                Email Verified Successfully!
              </CardTitle>
              <CardDescription>
                Your email address has been verified. You can now proceed to your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>

              <p className="text-sm text-muted-foreground">
                Welcome to Hola Stars! You can now access all features of your account.
              </p>

              <Link href="/auth">
                <Button className="w-full btn-gradient">
                  Continue to your dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (verificationError) {
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
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                Verification Failed
              </CardTitle>
              <CardDescription>
                We couldn't verify your email address. This link may be invalid or expired.
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>

              <p className="text-sm text-muted-foreground">
                Please try signing up again or contact our support team if you continue to experience issues.
              </p>

              <div className="space-y-2">
                <Link href="/auth">
                  <Button className="w-full btn-gradient">
                    Try Again
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default EmailVerification;
