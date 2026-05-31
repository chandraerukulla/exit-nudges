"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Checkbox                                                           */
/*  Figma: 24×24, rounded-8                                           */
/*  Selected=False: outline on-surface-tertiary, white fill            */
/*  Selected=True: bg interactive-primary, white check icon            */
/*  Disabled: outline/fill uses surface-disabled color                 */
/*  Optional label text, gap-8                                         */
/* ------------------------------------------------------------------ */

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({
  checked = false,
  disabled = false,
  label,
  onChange,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-8",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className
      )}
    >
      <button
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          "relative flex h-24 w-24 shrink-0 items-center justify-center rounded-8 transition-colors",
          checked
            ? disabled
              ? "bg-border-primary"
              : "bg-interactive-primary"
            : disabled
              ? "border-[1.5px] border-border-primary bg-surface-primary"
              : "border-[1.5px] border-on-surface-tertiary bg-surface-primary"
        )}
      >
        {checked && (
          <Check
            className="h-12 w-12 text-interactive-contrast"
            strokeWidth={2.5}
          />
        )}
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
