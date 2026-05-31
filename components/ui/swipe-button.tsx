"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Swipe button — drag-to-confirm gesture (matches Figma: Swipe button component)
 *
 * Figma spec:
 *   Width: fill (full-width)
 *   Height: 56px fixed
 *   Padding: 4px all sides
 *   Radius: 9999px (pill)
 *   bg: surface-secondary
 *   Thumb: 64×48, bg interactive-primary, rounded-full, arrow-right 24×24
 *   Label: Haffer SemiBold 16/24, on-surface-primary, centered
 *   States: Default / Swiping / Completed
 */
export interface SwipeButtonProps {
  label?: string;
  completedLabel?: string;
  onConfirm?: () => void;
  className?: string;
  disabled?: boolean;
}

export function SwipeButton({
  label = "Swipe to confirm",
  completedLabel = "Confirmed",
  onConfirm,
  className,
  disabled,
}: SwipeButtonProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [completed, setCompleted] = React.useState(false);
  const [trackWidth, setTrackWidth] = React.useState(0);

  const x = useMotionValue(0);
  const thumbWidth = 64;
  const maxDrag = trackWidth - thumbWidth;

  // Progress fill behind thumb
  const fillWidth = useTransform(x, [0, maxDrag || 1], [thumbWidth + 8, trackWidth]);
  const labelOpacity = useTransform(x, [0, maxDrag * 0.4], [1, 0]);

  React.useEffect(() => {
    if (containerRef.current) {
      setTrackWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const handleDragEnd = () => {
    if (x.get() >= maxDrag * 0.85) {
      setCompleted(true);
      onConfirm?.();
    }
  };

  const reset = () => {
    setCompleted(false);
    x.set(0);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-[56px] w-full items-center overflow-hidden rounded-full bg-surface-secondary p-4",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {completed ? (
          <motion.div
            key="completed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full w-full items-center justify-center rounded-full bg-brand-maroon"
            onClick={reset}
          >
            <span className="mr-8 font-semibold text-[16px] leading-[24px] tracking-[-0.009em] text-on-brand-light">
              {completedLabel}
            </span>
            <Check className="h-20 w-20 text-on-brand-light" />
          </motion.div>
        ) : (
          <>
            {/* Progress fill */}
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-interactive-primary"
              style={{ width: fillWidth }}
            />

            {/* Center label */}
            <motion.span
              className="absolute inset-0 flex items-center justify-center font-semibold text-[16px] leading-[24px] tracking-[-0.009em] text-on-surface-primary"
              style={{ opacity: labelOpacity }}
            >
              {label}
            </motion.span>

            {/* Draggable thumb */}
            <motion.div
              className="relative z-10 flex h-[48px] w-[64px] cursor-grab items-center justify-center rounded-full bg-interactive-primary active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: maxDrag }}
              dragElastic={0}
              dragMomentum={false}
              style={{ x }}
              onDragEnd={handleDragEnd}
            >
              <ArrowRight className="h-24 w-24 text-interactive-contrast" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
