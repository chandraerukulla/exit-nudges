import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-4 rounded-full px-8 py-4 type-labelHeavySm",
  {
    variants: {
      variant: {
        neutral: "bg-surface-tertiary text-on-surface-primary",
        accent: "bg-accent-light text-accent-on-light",
        success: "bg-success-light text-success-on-light",
        warning: "bg-warning-light text-warning-on-light",
        error: "bg-error-light text-error-on-light",
        solid: "bg-interactive-primary text-interactive-contrast",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
