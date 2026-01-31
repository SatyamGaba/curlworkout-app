"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Card, CardContent } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loading, error } = useAuthContext();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await login();
      router.push("/dashboard");
    } catch (err) {
      console.error("Sign in error:", err);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            CurlWorkout
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            AI-powered workout tracking
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-6">
              Sign in to continue
            </h2>

            <GoogleSignInButton
              onClick={handleSignIn}
              isLoading={isSigningIn}
            />

            {error && (
              <p className="mt-4 text-sm text-center text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
              By signing in, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
