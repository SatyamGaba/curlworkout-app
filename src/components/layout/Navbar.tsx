"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/helpers";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/routines", label: "Routines" },
  { href: "/history", label: "History" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, userProfile, logout, loading } = useAuthContext();

  return (
    <nav className="sticky top-0 z-30 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Nav Links */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
                CurlWorkout
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href ||
                      pathname.startsWith(item.href + "/")
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Link href="/settings">
              <div className="flex items-center gap-3 cursor-pointer">
                {userProfile?.photoURL ? (
                  <Image
                    src={userProfile.photoURL}
                    alt={userProfile.displayName}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                      {userProfile?.displayName?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {userProfile?.displayName || "User"}
                </span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              disabled={loading}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 text-center py-2 text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
