"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Tabs                                                               */
/*  Figma: Underline indicator style (NOT segmented controller)        */
/*  px-20, horizontal tab items, gap-16                                */
/*  Each tab: py-12, label 14/20 medium                               */
/*  Active: text-on-surface-primary + 4px bottom indicator bar         */
/*  Inactive: text-on-surface-tertiary                                 */
/*  Optional top divider (4px, border-primary)                         */
/* ------------------------------------------------------------------ */

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  layoutId: string;
}
const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  value: controlled,
  defaultValue,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const value = controlled ?? internal;
  const layoutId = React.useId();

  const setValue = (v: string) => {
    if (controlled === undefined) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value, setValue, layoutId }}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: React.ReactNode;
  /** Show top divider line */
  showDivider?: boolean;
  className?: string;
}

export function TabsList({
  children,
  showDivider = true,
  className,
}: TabsListProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        role="tablist"
        className="relative z-10 flex items-end gap-16 px-20"
      >
        {children}
      </div>
      {showDivider && (
        <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-border-primary" />
      )}
    </div>
  );
}

export function TabsTrigger({
  value: triggerValue,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used inside Tabs");
  const isActive = ctx.value === triggerValue;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => ctx.setValue(triggerValue)}
      className={cn(
        "relative flex flex-col items-center",
        className
      )}
    >
      {/* Label area */}
      <div className="py-12">
        <span
          className={cn(
            "text-[14px] leading-[20px] tracking-[-0.006em] transition-colors",
            isActive
              ? "font-semibold text-on-surface-primary"
              : "font-medium text-on-surface-tertiary"
          )}
        >
          {children}
        </span>
      </div>

      {/* 4px indicator — active: black bar on top of grey divider */}
      {isActive ? (
        <motion.div
          layoutId={ctx.layoutId}
          className="h-[4px] w-full rounded-full bg-on-surface-primary"
          transition={{ type: "spring", damping: 28, stiffness: 380 }}
        />
      ) : (
        <div className="h-[4px] w-full" />
      )}
    </button>
  );
}

export function TabsContent({
  value: contentValue,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used inside Tabs");
  if (ctx.value !== contentValue) return null;
  return <div className={className}>{children}</div>;
}
