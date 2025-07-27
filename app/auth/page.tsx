'use client'
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/ui/Logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
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
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-600">
              {isSignUp ? "Create Your Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? "Join thousands of businesses building better customer relationships"
                : "Sign in to your Hola Stars account"
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={isSignUp ? "sign_up" : "sign_in"} onValueChange={(value) => setIsSignUp(value === "sign_up")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="sign_up">Sign Up</TabsTrigger>
                <TabsTrigger value="sign_in">Sign In</TabsTrigger>
              </TabsList>

              <TabsContent value="sign_up">
                <SignUpForm setIsSignUp={setIsSignUp} />
              </TabsContent>

              <TabsContent value="sign_in">
                <SignInForm />
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              By {isSignUp ? "creating an account" : "signing in"}, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;