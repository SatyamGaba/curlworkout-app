import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/helpers";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "neumorphic" | "neumorphic-sm" | "stat-pill";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default:
        "bg-surface shadow-cal border border-border-light",
      outlined:
        "bg-surface border border-border",
      neumorphic:
        "neumorphic-card",
      "neumorphic-sm":
        "neumorphic-card-sm",
      "stat-pill":
        "stat-pill",
    };

    const radiusMap = {
      default: "rounded-3xl",
      outlined: "rounded-3xl",
      neumorphic: "", // radius handled by CSS class
      "neumorphic-sm": "", // radius handled by CSS class
      "stat-pill": "", // radius handled by CSS class
    };

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden transition-all duration-200",
          radiusMap[variant],
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-6 py-4 border-b border-border-light", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("px-6 py-5", className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "px-6 py-4 bg-surface-secondary border-t border-border-light",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
