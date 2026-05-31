"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Radio                                                              */
/*  Figma: 24×24 circle                                                */
/*  Selected=False: outline on-surface-tertiary, white fill            */
/*  Selected=True: bg interactive-primary, white inner dot (8×8)       */
/*  Disabled: outline/fill uses interactive-disabled color              */
/* ------------------------------------------------------------------ */

export interface RadioProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Radio({
  checked = false,
  disabled = false,
  label,
  name,
  value = "",
  onChange,
  className,
}: RadioProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-8",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className
      )}
    >
      <button
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(value)}
        className={cn(
          "relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full transition-colors",
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
          <div className="h-8 w-8 rounded-full bg-interactive-contrast" />
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
