"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "neutral" | "success" | "error" | "warning";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  show: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}
const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = React.useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).slice(2);
      const item: ToastItem = { id, duration: 3000, variant: "neutral", ...toast };
      setToasts((t) => [...t, item]);
      if (item.duration && item.duration > 0) {
        setTimeout(() => dismiss(id), item.duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toasts, show, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

function variantStyles(variant: ToastVariant = "neutral") {
  switch (variant) {
    case "success":
      return { className: "bg-success-light text-success-on-light border-success-border", icon: CheckCircle2 };
    case "error":
      return { className: "bg-error-light text-error-on-light border-error-border", icon: AlertCircle };
    case "warning":
      return { className: "bg-warning-light text-warning-on-light border-warning-border", icon: AlertCircle };
    default:
      return { className: "bg-surface-contrast text-on-surface-contrast border-transparent", icon: Info };
  }
}

function ToastViewport({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] mx-auto flex max-w-[430px] flex-col gap-8 px-16 pb-24">
      <AnimatePresence>
        {toasts.map((t) => {
          const { className, icon: Icon } = variantStyles(t.variant);
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ y: 24, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className={cn(
                "pointer-events-auto flex items-start gap-12 rounded-16 border p-12 shadow-lg",
                className
              )}
            >
              <Icon className="mt-2 h-20 w-20 shrink-0" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="type-labelHeavyLg">{t.title}</div>
                {t.description && <div className="type-labelMd opacity-80">{t.description}</div>}
              </div>
              <button
                onClick={() => onDismiss(t.id)}
                aria-label="Dismiss"
                className="shrink-0 rounded-8 p-4 hover:bg-overlay-light-hover"
              >
                <X className="h-16 w-16" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
