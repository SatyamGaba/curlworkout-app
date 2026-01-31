import { ReactNode } from "react";
import { cn } from "@/lib/utils/helpers";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function PageContainer({
  children,
  className,
  title,
  description,
  action,
}: PageContainerProps) {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
