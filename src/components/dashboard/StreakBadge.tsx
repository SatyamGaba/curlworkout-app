"use client";

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border-light rounded-full shadow-cal-sm">
      <span className="text-base">🔥</span>
      <span className="text-sm font-semibold text-text-primary">
        {streak}
      </span>
    </div>
  );
}
