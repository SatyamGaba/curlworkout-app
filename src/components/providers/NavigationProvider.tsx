"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getTabIndex } from "@/components/layout/BottomTabBar";

type NavigationDirection = "left" | "right" | "none";

interface NavigationContextType {
  direction: NavigationDirection;
  currentTabIndex: number;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [direction, setDirection] = useState<NavigationDirection>("none");
  const previousTabIndexRef = useRef<number>(-1);
  const currentTabIndex = getTabIndex(pathname || "/dashboard");

  useEffect(() => {
    if (previousTabIndexRef.current === -1) {
      // First render, no direction
      previousTabIndexRef.current = currentTabIndex;
      return;
    }

    const prevIndex = previousTabIndexRef.current;
    
    if (currentTabIndex > prevIndex) {
      // Moving right (e.g., Home -> Routines)
      setDirection("right");
    } else if (currentTabIndex < prevIndex) {
      // Moving left (e.g., Profile -> History)
      setDirection("left");
    } else {
      // Same tab or sub-route
      setDirection("none");
    }

    previousTabIndexRef.current = currentTabIndex;
  }, [currentTabIndex, pathname]);

  return (
    <NavigationContext.Provider value={{ direction, currentTabIndex }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
