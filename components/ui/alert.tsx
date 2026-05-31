"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, X } from "lucide-react";
import { PillButton } from "./pill-button";

/* ------------------------------------------------------------------ */
/*  Alert                                                              */
/*  Figma: Type=Section|Inline × Color=Neutral|Success|Warning|Error|Accent */
/*  Section: p-16, gap-12, rounded-12                                  */
/*  Inline:  p-12, gap-8,  rounded-12                                  */
/* ------------------------------------------------------------------ */

const alertVariants = cva("flex items-start rounded-12", {
  variants: {
    type: {
      section: "p-16 gap-12",
      inline: "p-12 gap-8",
    },
    color: {
      neutral: "bg-surface-secondary",
      success: "bg-success-light",
      warning: "bg-warning-light",
      error: "bg-error-light",
      accent: "bg-accent-light",
    },
  },
  defaultVariants: {
    type: "section",
    color: "neutral",
  },
});

const iconColorMap: Record<string, string> = {
  neutral: "text-on-surface-primary",
  success: "text-success-on-light",
  warning: "text-warning-on-light",
  error: "text-error-on-light",
  accent: "text-accent-on-light",
};

const titleColorMap: Record<string, string> = {
  neutral: "text-on-surface-primary",
  success: "text-success-on-light",
  warning: "text-warning-on-light",
  error: "text-error-on-light",
  accent: "text-accent-on-light",
};

const bodyColorMap: Record<string, string> = {
  neutral: "text-on-surface-secondary",
  success: "text-success-on-light",
  warning: "text-warning-on-light",
  error: "text-error-on-light",
  accent: "text-accent-on-light",
};

function defaultIcon(color: string) {
  switch (color) {
    case "success":
      return CheckCircle2;
    case "warning":
      return AlertTriangle;
    case "error":
      return AlertCircle;
    case "accent":
      return Sparkles;
    default:
      return Info;
  }
}

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "color">,
    VariantProps<typeof alertVariants> {
  /** Title text (optional) */
  title?: React.ReactNode;
  /** Body / description text (optional) */
  body?: React.ReactNode;
  /** Show leading icon */
  showIcon?: boolean;
  /** Custom icon override */
  icon?: React.ReactNode;
  /** Show dismiss X button */
  canDismiss?: boolean;
  /** Called when dismiss is clicked */
  onDismiss?: () => void;
  /** Action button label */
  actionLabel?: string;
  /** Called when action button is clicked */
  onAction?: () => void;
}

export function Alert({
  type = "section",
  color = "neutral",
  title,
  body,
  showIcon = true,
  icon,
  canDismiss = false,
  onDismiss,
  actionLabel,
  onAction,
  className,
  ...props
}: AlertProps) {
  const colorKey = color ?? "neutral";
  const IconComponent = defaultIcon(colorKey);
  const iconSize = type === "section" ? "h-20 w-20" : "h-16 w-16";

  return (
    <div className={cn(alertVariants({ type, color }), className)} role="alert" {...props}>
      {/* Leading icon */}
      {showIcon && (
        <div className={cn("shrink-0 pt-[2px]", iconColorMap[colorKey])}>
          {icon ?? <IconComponent className={iconSize} />}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col gap-16">
        {/* Content: title + body */}
        <div className="flex flex-col gap-4">
          {title && (
            <p
              className={cn(
                "font-medium text-[14px] leading-[20px] tracking-[-0.006em]",
                titleColorMap[colorKey]
              )}
            >
              {title}
            </p>
          )}
          {body && (
            <p
              className={cn(
                "text-[14px] leading-[20px] tracking-[-0.006em]",
                bodyColorMap[colorKey]
              )}
            >
              {body}
            </p>
          )}
        </div>

        {/* Action */}
        {actionLabel && onAction && (
          <div>
            <PillButton hierarchy="primary" size="xsmall" onClick={onAction}>
              {actionLabel}
            </PillButton>
          </div>
        )}
      </div>

      {/* Dismiss */}
      {canDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn("shrink-0 p-2", iconColorMap[colorKey])}
        >
          <X className={type === "section" ? "h-20 w-20" : "h-16 w-16"} />
        </button>
      )}
    </div>
  );
}
