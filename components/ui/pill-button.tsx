"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pill button — compact inline action (matches Figma: Pill button component)
 *
 * Figma spec:
 *   Width: hug (compact)
 *   Small:  px-12 py-8, gap-4, font Haffer Medium 14/20, ls -0.6%, icon 16×16
 *   XSmall: p-8,        gap-4, font Haffer Medium 11/16, ls  0.5%, icon 12×12
 *   Radius: 9999px (pill)
 *   Hierarchy: Primary / Contrast / Secondary / Tertiary
 *   States: Default / Pressed / Disabled
 *   Trailing arrow icon always visible
 *   Leading icon hidden by default (optional slot)
 */
const pillVariants = cva(
  [
    "inline-flex items-center rounded-full font-medium transition-all",
    "active:scale-[0.97] disabled:pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary",
  ].join(" "),
  {
    variants: {
      hierarchy: {
        primary:
          "bg-interactive-primary text-interactive-contrast hover:opacity-90 focus-visible:ring-interactive-primary disabled:bg-interactive-disabled disabled:text-on-surface-disabled",
        contrast:
          "bg-interactive-contrast text-interactive-primary hover:opacity-90 focus-visible:ring-interactive-contrast disabled:bg-interactive-disabled disabled:text-on-surface-disabled",
        secondary:
          "bg-surface-secondary text-on-surface-primary border border-border-secondary hover:bg-surface-tertiary focus-visible:ring-on-surface-primary disabled:bg-interactive-disabled disabled:text-on-surface-disabled disabled:border-border-disabled",
        tertiary:
          "bg-transparent text-on-surface-primary underline hover:opacity-70 focus-visible:ring-on-surface-primary disabled:text-on-surface-disabled disabled:no-underline",
      },
      size: {
        small: "gap-4 px-12 py-8 text-[14px] leading-[20px] tracking-[-0.006em]",
        xsmall: "gap-4 p-8 text-[11px] leading-[16px] tracking-[0.005em]",
      },
    },
    defaultVariants: {
      hierarchy: "primary",
      size: "small",
    },
  }
);

export interface PillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pillVariants> {
  leadingIcon?: React.ReactNode;
  hideTrailingArrow?: boolean;
}

export const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ className, hierarchy, size, leadingIcon, hideTrailingArrow, children, ...props }, ref) => {
    const iconSize = size === "xsmall" ? "h-12 w-12" : "h-16 w-16";

    return (
      <button
        ref={ref}
        className={cn(pillVariants({ hierarchy, size }), className)}
        {...props}
      >
        {leadingIcon && <span className={iconSize}>{leadingIcon}</span>}
        <span className="px-4">{children}</span>
        {!hideTrailingArrow && <ArrowRight className={iconSize} />}
      </button>
    );
  }
);
PillButton.displayName = "PillButton";
