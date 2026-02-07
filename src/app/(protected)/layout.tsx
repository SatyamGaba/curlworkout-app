"use client";

import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { NavigationProvider } from "@/components/providers/NavigationProvider";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { PageTransition } from "@/components/layout/PageTransition";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuthContext();

  // Check if we're on a workout page - hide navbar for focused experience
  const isWorkoutPage = pathname?.startsWith("/workout/");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // FAB click handler - navigate to create new routine
  const handleFabClick = useCallback(() => {
    router.push("/routines/new");
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-app">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-text-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gradient-app overflow-hidden">
        <main className={isWorkoutPage ? "" : "pb-32"}>
          <PageTransition key={pathname}>
            {children}
          </PageTransition>
        </main>
        {!isWorkoutPage && <BottomTabBar onFabClick={handleFabClick} />}
      </div>
    </NavigationProvider>
  );
}
