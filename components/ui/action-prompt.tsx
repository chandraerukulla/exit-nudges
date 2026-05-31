"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { StandardButton } from "./button";

/* ------------------------------------------------------------------ */
/*  Action Prompt                                                      */
/*  Figma: Color=Neutral|Accent|Warning|Success|Error, rounded-16     */
/*  Contains: progress indicator, title + subtitle, 1-2 action buttons */
/* ------------------------------------------------------------------ */

const promptVariants = cva("flex flex-col rounded-16 overflow-hidden", {
  variants: {
    color: {
      neutral: "bg-surface-secondary",
      accent: "bg-accent-light",
      warning: "bg-warning-light",
      success: "bg-success-light",
      error: "bg-error-light",
    },
  },
  defaultVariants: {
    color: "neutral",
  },
});

export interface ActionPromptProps
  extends VariantProps<typeof promptVariants> {
  /** Primary title */
  title: string;
  /** Secondary description */
  description?: string;
  /** Progress: current step (e.g. 1) */
  currentStep?: number;
  /** Progress: total steps (e.g. 3) */
  totalSteps?: number;
  /** Primary action button label */
  primaryAction?: string;
  /** Primary action callback */
  onPrimaryAction?: () => void;
  /** Secondary action button label */
  secondaryAction?: string;
  /** Secondary action callback */
  onSecondaryAction?: () => void;
  /** Leading icon/element (replaces progress indicator) */
  leading?: React.ReactNode;
  className?: string;
}

export function ActionPrompt({
  color = "neutral",
  title,
  description,
  currentStep,
  totalSteps,
  primaryAction,
  onPrimaryAction,
  secondaryAction,
  onSecondaryAction,
  leading,
  className,
}: ActionPromptProps) {
  const showProgress = currentStep !== undefined && totalSteps !== undefined;

  return (
    <div className={cn(promptVariants({ color }), className)}>
      {/* List item row */}
      <div className="flex items-center gap-16 px-20 py-16">
        {/* Leading: progress ring or custom */}
        {(showProgress || leading) && (
          <div className="shrink-0">
            {leading ??
              (showProgress && (
                <ProgressRing
                  current={currentStep!}
                  total={totalSteps!}
                />
              ))}
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4">
          <span className="text-[16px] font-semibold leading-[24px] tracking-[-0.009em] text-on-surface-primary">
            {title}
          </span>
          {description && (
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.006em] text-on-surface-secondary">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {(primaryAction || secondaryAction) && (
        <div className="flex gap-8 px-16 pb-16 pt-8">
          {secondaryAction && (
            <div className="flex-1">
              <StandardButton
                hierarchy="secondary"
                onClick={onSecondaryAction}
              >
                {secondaryAction}
              </StandardButton>
            </div>
          )}
          {primaryAction && (
            <div className="flex-1">
              <StandardButton
                hierarchy="primary"
                onClick={onPrimaryAction}
              >
                {primaryAction}
              </StandardButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Circular progress ring with step counter */
function ProgressRing({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const size = 48;
  const stroke = 3;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = current / total;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-on-surface-primary opacity-10"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-on-surface-primary"
        />
      </svg>
      <span className="absolute text-[16px] font-semibold leading-[24px] tracking-[-0.009em] text-on-surface-primary">
        {current}/{total}
      </span>
    </div>
  );
}
