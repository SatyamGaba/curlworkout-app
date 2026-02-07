"use client";

import { useMemo, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/helpers";

interface DayInfo {
  date: Date;
  dayName: string;
  dayNum: number;
  isToday: boolean;
  hasWorkout: boolean;
  isFuture: boolean;
}

interface WeekInfo {
  weekStart: Date;
  days: DayInfo[];
}

interface CalendarWeekViewProps {
  workoutDates?: Date[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}

const WEEKS_TO_SHOW = 8; // Show 8 weeks back
const DAY_NAMES = ["M", "T", "W", "T", "F", "S", "S"];

export function CalendarWeekView({ 
  workoutDates = [], 
  selectedDate,
  onSelectDate 
}: CalendarWeekViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  // Generate weeks data
  const weeks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get the start of current week (Monday)
    const currentWeekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentWeekStart.setDate(today.getDate() + diff);
    
    const weeksData: WeekInfo[] = [];
    
    // Generate weeks going backwards
    for (let w = WEEKS_TO_SHOW - 1; w >= 0; w--) {
      const weekStart = new Date(currentWeekStart);
      weekStart.setDate(currentWeekStart.getDate() - (w * 7));
      
      const days: DayInfo[] = [];
      
      for (let d = 0; d < 7; d++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + d);
        date.setHours(0, 0, 0, 0);
        
        const isToday = date.toDateString() === today.toDateString();
        const isFuture = date > today;
        const hasWorkout = workoutDates.some(
          (wd) => new Date(wd).toDateString() === date.toDateString()
        );
        
        days.push({
          date,
          dayName: DAY_NAMES[d],
          dayNum: date.getDate(),
          isToday,
          hasWorkout,
          isFuture,
        });
      }
      
      weeksData.push({ weekStart, days });
    }
    
    return weeksData;
  }, [workoutDates]);

  // Scroll to current week on mount
  useEffect(() => {
    if (scrollRef.current && !hasScrolledRef.current) {
      // Scroll to the end (current week)
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      hasScrolledRef.current = true;
    }
  }, [weeks]);

  // Check if a date is selected
  const isSelected = useCallback((date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  }, [selectedDate]);

  // Handle day click
  const handleDayClick = (day: DayInfo) => {
    if (day.isFuture) return; // Can't select future dates
    
    // If clicking on already selected date, deselect (go back to weekly view)
    if (isSelected(day.date)) {
      onSelectDate(null);
    } else {
      onSelectDate(day.date);
    }
  };

  // Get styling for a day
  const getDayStyle = (day: DayInfo) => {
    const selected = isSelected(day.date);
    
    if (day.isToday) {
      // Today is always filled black
      return "bg-text-primary";
    }
    
    if (selected && !day.isToday) {
      // Selected past day = solid black border
      return "border-2 border-text-primary";
    }
    
    if (day.isFuture) {
      // Future dates are faded dashed
      return "border-2 border-dashed border-border/50";
    }
    
    // Past dates without selection = dashed border
    return "border-2 border-dashed border-border";
  };

  const getTextStyle = (day: DayInfo) => {
    const selected = isSelected(day.date);
    
    if (day.isToday) {
      return "text-background";
    }
    
    if (selected) {
      return "text-text-primary font-bold";
    }
    
    if (day.isFuture) {
      return "text-text-tertiary/50";
    }
    
    return "text-text-secondary";
  };

  return (
    <div className="relative">
      {/* Horizontal scrollable container */}
      <div 
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ 
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch" 
        }}
      >
        <div className="flex">
          {weeks.map((week, weekIndex) => (
            <div 
              key={weekIndex}
              className="flex-shrink-0 w-full px-1 py-3"
              style={{ scrollSnapAlign: "center" }}
            >
              <div className="flex items-center justify-between">
                {week.days.map((day, dayIndex) => (
                  <button
                    key={dayIndex}
                    onClick={() => handleDayClick(day)}
                    disabled={day.isFuture}
                    className={cn(
                      "flex flex-col items-center gap-1 transition-all",
                      day.isFuture ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                    )}
                  >
                    {/* Day name */}
                    <span
                      className={cn(
                        "text-xs font-medium",
                        day.isToday ? "text-text-primary" : "text-text-tertiary"
                      )}
                    >
                      {day.dayName}
                    </span>
                    
                    {/* Day number circle */}
                    <motion.div
                      whileTap={!day.isFuture ? { scale: 0.9 } : undefined}
                      className={cn(
                        "w-10 h-10 rounded-full flex flex-col items-center justify-center transition-all relative",
                        getDayStyle(day)
                      )}
                    >
                      <span className={cn("text-sm font-semibold", getTextStyle(day))}>
                        {day.dayNum}
                      </span>
                      
                      {/* Workout indicator dot (only for non-selected, non-today days with workouts) */}
                      {day.hasWorkout && !day.isToday && !isSelected(day.date) && (
                        <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-text-primary" />
                      )}
                    </motion.div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll hint gradient - left side */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent pointer-events-none opacity-50" />
    </div>
  );
}
