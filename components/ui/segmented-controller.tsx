"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Segmented Controller                                               */
/*  Figma: Pill track bg-surface-secondary, p-4, gap-8, rounded-full  */
/*  Each segment: fill-width, h-38, px-16, rounded-full               */
/*  Active: bg-surface-primary (white), text-on-surface-primary        */
/*  Inactive: transparent, text-on-surface-tertiary                    */
/* ------------------------------------------------------------------ */

export interface SegmentedControllerProps {
  segments: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedController({
  segments,
  value,
  onChange,
  className,
}: SegmentedControllerProps) {
  return (
    <div
      className={cn(
        "flex h-[46px] items-center gap-8 rounded-full bg-surface-secondary p-4",
        className
      )}
    >
      {segments.map((segment) => {
        const isActive = segment === value;
        return (
          <button
            key={segment}
            onClick={() => onChange(segment)}
            className={cn(
              "relative flex h-[38px] flex-1 items-center justify-center px-16 rounded-full overflow-hidden transition-colors",
              isActive
                ? "text-on-surface-primary"
                : "text-on-surface-tertiary"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="segmented-active"
                className="absolute inset-0 rounded-full bg-surface-primary"
                transition={{ type: "spring", damping: 28, stiffness: 380 }}
              />
            )}
            <span className="relative z-10 truncate text-[14px] font-medium leading-[20px] tracking-[-0.006em]">
              {segment}
            </span>
          </button>
        );
      })}
    </div>
  );
}
