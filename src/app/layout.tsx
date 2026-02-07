import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { WorkoutBootstrap } from "@/components/providers/WorkoutBootstrap";
import { ActiveWorkoutBanner } from "@/components/workout/ActiveWorkoutBanner";
import "./globals.css";

const sfPro = localFont({
  src: [
    {
      path: "../../Fonts/SF-Pro-Display-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../Fonts/SF-Pro-Display-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../Fonts/SF-Pro-Display-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../Fonts/SF-Pro-Display-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CurlAI - AI-Powered Workout Tracking",
  description: "Generate AI-powered workout routines and track your gym progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sfPro.variable} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-gradient-app font-sf-pro">
        <ThemeProvider>
          <ReduxProvider>
            <AuthProvider>
              <WorkoutBootstrap />
              {children}
              <ActiveWorkoutBanner />
            </AuthProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
