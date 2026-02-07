import { ReactNode } from "react";
import { cn } from "@/lib/utils/helpers";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  /** Use gradient background instead of solid */
  gradient?: boolean;
}

export function PageContainer({
  children,
  className,
  title,
  description,
  action,
  gradient = false,
}: PageContainerProps) {
  return (
    <div className={cn(
      "min-h-screen px-5 pt-12 pb-4",
      gradient ? "bg-gradient-page" : "",
      className
    )}>
      <div className="max-w-3xl mx-auto">
        {(title || action) && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              {title && (
                <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-1 text-sm text-text-secondary">
                  {description}
                </p>
              )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
