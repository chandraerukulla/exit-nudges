"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Standard button — full-width CTA (matches Figma: Standard button component)
 *
 * Figma spec:
 *   Width: fill (full-width)
 *   Padding: 24px horizontal, 16px vertical
 *   Radius: 9999px (pill)
 *   Font: Haffer SemiBold 16/24, letterSpacing -0.9%
 *   Hierarchy: Primary / Secondary / Tertiary
 *   States: Default / Pressed / Disabled / Loading
 */
const standardButtonVariants = cva(
  [
    "relative flex w-full items-center justify-center rounded-full px-24 py-16",
    "font-semibold text-[16px] leading-[24px] tracking-[-0.009em]",
    "transition-all active:scale-[0.98] disabled:pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary",
  ].join(" "),
  {
    variants: {
      hierarchy: {
        primary:
          "bg-interactive-primary text-interactive-contrast hover:opacity-90 focus-visible:ring-interactive-primary disabled:bg-interactive-disabled disabled:text-on-surface-disabled",
        secondary:
          "bg-surface-secondary text-on-surface-primary border border-border-secondary hover:bg-surface-tertiary focus-visible:ring-on-surface-primary disabled:bg-interactive-disabled disabled:text-on-surface-disabled disabled:border-border-disabled",
        tertiary:
          "bg-transparent text-on-surface-primary underline hover:opacity-70 focus-visible:ring-on-surface-primary disabled:text-on-surface-disabled disabled:no-underline",
      },
    },
    defaultVariants: {
      hierarchy: "primary",
    },
  }
);

export interface StandardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof standardButtonVariants> {
  loading?: boolean;
}

export const StandardButton = React.forwardRef<HTMLButtonElement, StandardButtonProps>(
  ({ className, hierarchy, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(standardButtonVariants({ hierarchy }), className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-20 w-20 animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  }
);
StandardButton.displayName = "StandardButton";
