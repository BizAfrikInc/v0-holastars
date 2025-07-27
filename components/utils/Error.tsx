"use client"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation"
import { ReactElement } from "react"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/ui/Logo";

const Error = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const errorType = searchParams.get('type') || 'generic';
  interface Action {
    label: string;
    href: string;
    variant: "link" | "default" | "outline" | "destructive" | "secondary" | "ghost" | "gold" | "premium" | null | undefined;
    refresh?: boolean;
  }
  interface ErrorContent {
    message: string;
    title: string;
    icon:ReactElement;
    actions: Action[];
  }


  const getErrorContent = (type: string): ErrorContent => {
    switch (type) {
      case 'session_expired':
        return {
          title: 'Session Expired',
          message: 'Your session has expired. Please log in again.',
          icon: <AlertTriangle className="h-16 w-16 text-amber-500" />,
          actions: [
            { label: 'Sign In', href: '/auth', variant: 'default' as const },
            { label: 'Back to Home', href: '/', variant: 'outline' as const }
          ]
        };

      case 'unauthorized':
        return {
          title: 'Access Denied',
          message: 'You are not authorized to access this resource.',
          icon: <AlertTriangle className="h-16 w-16 text-red-500" />,
          actions: [
            { label: 'Sign In', href: '/auth', variant: 'default' as const },
            { label: 'Back to Home', href: '/', variant: 'outline' as const }
          ]
        };

      case 'invalid_session':
        return {
          title: 'Invalid Session',
          message: 'Invalid session. Please try again.',
          icon: <AlertTriangle className="h-16 w-16 text-orange-500" />,
          actions: [
            { label: 'Sign In', href: '/auth', variant: 'default' as const },
            { label: 'Back to Home', href: '/', variant: 'outline' as const }
          ]
        };

      case 'network_error':
        return {
          title: 'Network Error',
          message: 'Unable to connect to our servers. Please check your internet connection and try again.',
          icon: <AlertTriangle className="h-16 w-16 text-blue-500" />,
          actions: [
            { label: 'Try Again', href: pathname, variant: 'default' as const, refresh: true },
            { label: 'Back to Home', href: '/', variant: 'outline' as const }
          ]
        };

      case 'user_creation_failed':
        return {
          title: 'Network Error',
          message: 'There was an error signing you up. Please try again. If the issue persists, kindly contact support at info@holastars.com',
          icon: <AlertTriangle className="h-16 w-16 text-blue-500" />,
          actions: [
            { label: 'Try Again', href: pathname, variant: 'default' as const, refresh: true },
            { label: 'Back to Home', href: '/', variant: 'outline' as const }
          ]
        };

      case 'server_error':
        return {
          title: 'Server Error',
          message: 'Something went wrong on our end. Our team has been notified and is working to fix the issue.',
          icon: <AlertTriangle className="h-16 w-16 text-red-600" />,
          actions: [
            { label: 'Try Again', href: pathname, variant: 'default' as const, refresh: true },
            { label: 'Contact Support', href: '/contact', variant: 'outline' as const }
          ]
        };

      case 'maintenance':
        return {
          title: 'Under Maintenance',
          message: 'We are currently performing scheduled maintenance. Please check back in a few minutes.',
          icon: <RefreshCw className="h-16 w-16 text-gray-500" />,
          actions: [
            { label: 'Try Again', href: pathname, variant: 'default' as const, refresh: true },
            { label: 'Back to Home', href: '/', variant: 'outline' as const }
          ]
        };

      default:
        return {
          title: 'Something Went Wrong',
          message: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
          icon: <AlertTriangle className="h-16 w-16 text-gray-500" />,
          actions: [
            { label: 'Try Again', href: pathname, variant: 'default' as const, refresh: true },
            { label: 'Back to Home', href: '/', variant: 'outline' as const }
          ]
        };
    }
  };


  const errorContent = getErrorContent(errorType);

  const handleAction = (action: Action) => {
    if (action.refresh) {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">
              {errorContent.title}
            </CardTitle>
            <CardDescription className="text-base">
              {errorContent.message}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="flex justify-center">
              {errorContent.icon}
            </div>

            <div className="space-y-3">
              {errorContent.actions.map((action, index) => (
                action.refresh ? (
                  <Button
                    key={index}
                    variant={action.variant}
                    className="w-full"
                    onClick={() => handleAction(action)}
                  >
                    {action.label}
                  </Button>
                ) : (
                  <Link key={index} href={action.href}>
                    <Button variant={action.variant} className="w-full">
                      {action.label}
                    </Button>
                  </Link>
                )
              ))}
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Error;