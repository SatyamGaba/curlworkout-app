import type { Metadata } from "next";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { WorkoutBootstrap } from "@/components/providers/WorkoutBootstrap";
import { ActiveWorkoutBanner } from "@/components/workout/ActiveWorkoutBanner";
import "./globals.css";
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: "CurlWorkout - AI-Powered Workout Tracking",
  description: "Generate AI-powered workout routines and track your gym progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50 dark:bg-gray-900">
        <ReduxProvider>
          <AuthProvider>
            <WorkoutBootstrap />
            {children}
            <ActiveWorkoutBanner />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
