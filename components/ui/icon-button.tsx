"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-12 transition-all active:scale-[0.95] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface-primary",
  {
    variants: {
      variant: {
        primary: "bg-interactive-primary text-interactive-contrast hover:opacity-90",
        secondary: "bg-interactive-secondary text-on-surface-primary hover:bg-surface-tertiary",
        ghost: "bg-transparent text-on-surface-primary hover:bg-overlay-light-hover",
        outline: "border border-border-secondary text-on-surface-primary hover:bg-overlay-light-hover",
      },
      size: {
        sm: "h-32 w-32",
        md: "h-40 w-40",
        lg: "h-48 w-48",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  "aria-label": string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
IconButton.displayName = "IconButton";
