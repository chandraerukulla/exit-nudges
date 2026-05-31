"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Toggle (Switch)                                                    */
/*  Figma: 40×24 pill track with 20×20 circular thumb                 */
/*  OFF: track on-surface-tertiary, thumb white (left)                 */
/*  ON:  track interactive-primary, thumb white (right) + check icon   */
/*  Disabled: track interactive-disabled                               */
/* ------------------------------------------------------------------ */

export interface ToggleProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Toggle({
  checked = false,
  disabled = false,
  label,
  onChange,
  className,
}: ToggleProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-8",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      <button
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          "relative flex h-24 w-40 shrink-0 items-center rounded-full p-[2px] transition-colors",
          checked
            ? disabled
              ? "bg-border-primary"
              : "bg-interactive-primary"
            : disabled
              ? "bg-border-primary"
              : "bg-on-surface-tertiary"
        )}
      >
        <motion.div
          className="h-20 w-20 rounded-full bg-interactive-contrast shadow-sm"
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 400 }}
        />
      </button>
      {label && (
        <span
          className={cn(
            "text-[14px] leading-[20px] tracking-[-0.006em]",
            disabled ? "text-on-surface-tertiary" : "text-on-surface-primary"
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
}
