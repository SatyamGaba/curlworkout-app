import type { Metadata } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
