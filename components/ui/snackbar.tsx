"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { PillButton } from "./pill-button";

/* ------------------------------------------------------------------ */
/*  Snackbar                                                           */
/*  Figma: State=Default|Loading                                       */
/*  Dark surface-contrast bg, p-12, gap-8, rounded-12                 */
/*  Shadow: 0 16px 48px black/22%                                      */
/*  Label: 16/24 weight-400, on-surface-contrast (white in light mode) */
/*  Optional: leading icon 24px, action PillButton contrast            */
/* ------------------------------------------------------------------ */

export interface SnackbarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  loading?: boolean;
  duration?: number;
}

interface SnackbarContextValue {
  snackbars: SnackbarItem[];
  show: (snackbar: Omit<SnackbarItem, "id">) => void;
  dismiss: (id: string) => void;
}

const SnackbarContext = React.createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbars, setSnackbars] = React.useState<SnackbarItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setSnackbars((s) => s.filter((x) => x.id !== id));
  }, []);

  const show = React.useCallback(
    (snackbar: Omit<SnackbarItem, "id">) => {
      const id = Math.random().toString(36).slice(2);
      const item: SnackbarItem = { id, duration: 4000, ...snackbar };
      setSnackbars((s) => [...s, item]);
      if (item.duration && item.duration > 0) {
        setTimeout(() => dismiss(id), item.duration);
      }
    },
    [dismiss]
  );

  return (
    <SnackbarContext.Provider value={{ snackbars, show, dismiss }}>
      {children}
      <SnackbarViewport snackbars={snackbars} onDismiss={dismiss} />
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = React.useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used inside SnackbarProvider");
  return ctx;
}

function SnackbarViewport({
  snackbars,
  onDismiss,
}: {
  snackbars: SnackbarItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] mx-auto flex max-w-[430px] flex-col gap-8 px-16 pb-24">
      <AnimatePresence>
        {snackbars.map((s) => (
          <motion.div
            key={s.id}
            layout
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="pointer-events-auto flex items-center gap-8 rounded-12 bg-surface-contrast p-12 shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
          >
            {/* Leading icon or loader */}
            {(s.showIcon || s.loading) && (
              <div className="flex h-32 w-32 shrink-0 items-center justify-center">
                {s.loading ? (
                  <CircularLoader />
                ) : (
                  s.icon ?? (
                    <CheckCircle2 className="h-24 w-24 text-on-surface-contrast" />
                  )
                )}
              </div>
            )}

            {/* Label */}
            <div className="flex-1 text-[16px] font-normal leading-[24px] tracking-[-0.009em] text-on-surface-contrast truncate">
              {s.label}
            </div>

            {/* Action */}
            {s.actionLabel && (
              <PillButton
                hierarchy="contrast"
                size="xsmall"
                hideTrailingArrow
                onClick={() => {
                  s.onAction?.();
                  onDismiss(s.id);
                }}
              >
                {s.actionLabel}
              </PillButton>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Circular ring loader matching Figma spec */
function CircularLoader({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-24 w-24 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.67"
        className="text-surface-primary opacity-30"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2.67"
        strokeLinecap="round"
        className="text-accent-solid"
      />
    </svg>
  );
}
