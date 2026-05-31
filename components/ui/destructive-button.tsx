"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Destructive button — full-width danger action (matches Figma: Destructive button component)
 *
 * Figma spec:
 *   Width: fill (full-width)
 *   Padding: 24px horizontal, 16px vertical
 *   Radius: 9999px (pill)
 *   Font: Haffer SemiBold 16/24, letterSpacing -0.9%
 *   Type: Primary (solid red) / Tertiary (text-only red, underlined)
 *   States: Default / Pressed / Disabled / Loading
 */
const destructiveVariants = cva(
  [
    "relative flex w-full items-center justify-center rounded-full px-24 py-16",
    "font-semibold text-[16px] leading-[24px] tracking-[-0.009em]",
    "transition-all active:scale-[0.98] disabled:pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-solid focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary",
  ].join(" "),
  {
    variants: {
      hierarchy: {
        primary:
          "bg-error-solid text-error-on-solid hover:opacity-90 disabled:bg-interactive-disabled disabled:text-on-surface-disabled",
        tertiary:
          "bg-transparent text-error-on-light underline hover:opacity-70 disabled:text-on-surface-disabled disabled:no-underline",
      },
    },
    defaultVariants: {
      hierarchy: "primary",
    },
  }
);

export interface DestructiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof destructiveVariants> {
  loading?: boolean;
}

export const DestructiveButton = React.forwardRef<HTMLButtonElement, DestructiveButtonProps>(
  ({ className, hierarchy, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(destructiveVariants({ hierarchy }), className)}
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
DestructiveButton.displayName = "DestructiveButton";
