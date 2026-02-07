"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { AppleSignInButton } from "@/components/auth/AppleSignInButton";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export default function LoginPage() {
  const router = useRouter();
  const { user, loginWithGoogle, loginWithApple, loading, error } = useAuthContext();
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);
  const [isSigningInApple, setIsSigningInApple] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningInGoogle(true);
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      console.error("Google sign in error:", err);
    } finally {
      setIsSigningInGoogle(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsSigningInApple(true);
      await loginWithApple();
      router.push("/dashboard");
    } catch (err) {
      console.error("Apple sign in error:", err);
    } finally {
      setIsSigningInApple(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Progress bar area */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg 
              className="w-6 h-6 text-gray-900 dark:text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>
          <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gray-900 dark:bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-16">
          Create an account
        </h1>

        {/* Auth buttons */}
        <div className="space-y-4 mt-auto mb-8">
          <AppleSignInButton
            onClick={handleAppleSignIn}
            isLoading={isSigningInApple}
          />

          <GoogleSignInButton
            onClick={handleGoogleSignIn}
            isLoading={isSigningInGoogle}
          />

          {error && (
            <p className="text-sm text-center text-red-600 dark:text-red-400 mt-4">
              {error}
            </p>
          )}
        </div>

        {/* Terms */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 pb-8">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
