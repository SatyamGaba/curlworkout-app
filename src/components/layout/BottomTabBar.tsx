"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/helpers";

// Tab configuration with indices for navigation direction tracking
export const TAB_ROUTES = ["/dashboard", "/routines", "/history", "/profile"] as const;

export function getTabIndex(pathname: string): number {
  const index = TAB_ROUTES.findIndex(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  return index >= 0 ? index : 0;
}

const tabs = [
  {
    href: "/dashboard",
    label: "Home",
    icon: (active: boolean) => (
      <svg
        className={cn("w-6 h-6 transition-colors", active ? "text-text-primary" : "text-text-tertiary")}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    href: "/routines",
    label: "Routines",
    icon: (active: boolean) => (
      <svg
        className={cn("w-6 h-6 transition-colors", active ? "text-text-primary" : "text-text-tertiary")}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "History",
    icon: (active: boolean) => (
      <svg
        className={cn("w-6 h-6 transition-colors", active ? "text-text-primary" : "text-text-tertiary")}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (active: boolean) => (
      <svg
        className={cn("w-6 h-6 transition-colors", active ? "text-text-primary" : "text-text-tertiary")}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={active ? 0 : 1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

interface BottomTabBarProps {
  showFab?: boolean;
  onFabClick?: () => void;
}

export function BottomTabBar({ showFab = true, onFabClick }: BottomTabBarProps) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe">
      <div className="flex items-center justify-center gap-3 max-w-lg mx-auto mb-4">
        {/* Tab Bar Container - Cal AI style rounded container */}
        <nav className="tab-bar flex items-center justify-around flex-1 h-[72px] px-4 rounded-[28px]">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
            
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-1 min-w-0 flex-col items-center justify-center py-2 rounded-2xl transition-all duration-200",
                  isActive
                    ? "text-text-primary bg-surface-secondary"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-surface-secondary/50"
                )}
              >
                {tab.icon(isActive)}
                <span className={cn(
                  "text-[11px] mt-1 transition-colors",
                  isActive ? "font-medium text-text-primary" : "font-normal text-text-tertiary"
                )}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Floating Action Button - Cal AI style, outside navbar */}
        {showFab && (
          <button
            onClick={onFabClick}
            className="fab flex-shrink-0 flex items-center justify-center"
            aria-label="Add new"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
