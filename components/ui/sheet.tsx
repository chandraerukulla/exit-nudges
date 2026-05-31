"use client";

import * as React from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Sheet({ open, onOpenChange, children, title, className }: SheetProps) {
  const dragControls = useDragControls();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-overlay-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            key="sheet"
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-[430px] flex-col rounded-t-24 bg-surface-primary pb-32 pt-12 shadow-2xl",
              className
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onOpenChange(false);
            }}
          >
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="mx-auto mb-12 h-4 w-40 cursor-grab touch-none rounded-full bg-border-secondary active:cursor-grabbing"
            />
            {title && (
              <h2 className="px-20 pb-12 type-titleLg text-on-surface-primary">{title}</h2>
            )}
            <div className="flex flex-col gap-12 px-20">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
