import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/helpers";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "cal-dark" | "cal-outline";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  pill?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      pill = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
      // Cal AI style - dark primary button
      primary:
        "bg-text-primary text-background hover:opacity-90 focus:ring-neutral-500",
      // Cal AI style - outline pill button
      secondary:
        "bg-surface-secondary text-text-primary border border-border-light hover:bg-surface hover:border-border focus:ring-neutral-400",
      outline:
        "border border-border bg-transparent text-text-primary hover:bg-surface-secondary focus:ring-neutral-400",
      ghost:
        "bg-transparent text-text-primary hover:bg-surface-secondary focus:ring-neutral-400",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      // Explicit Cal AI variants
      "cal-dark":
        "bg-text-primary text-background hover:opacity-90 focus:ring-neutral-500 shadow-cal-sm hover:shadow-cal",
      "cal-outline":
        "border border-border bg-transparent text-text-primary hover:bg-surface-secondary focus:ring-neutral-400",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-base",
    };

    const radiusStyle = pill ? "rounded-full" : "rounded-2xl";

    return (
      <button
        ref={ref}
        className={cn(baseStyles, radiusStyle, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
