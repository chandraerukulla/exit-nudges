"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Home, Send, TrendingUp, Menu } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Bottom Bar (Tab Bar)                                               */
/*  Figma: Pill-shaped tab bar, bg-surface-secondary                   */
/*  Each tab: vertical icon+label, active tab bg-surface-primary       */
/*  px-12 py-6 on outer wrapper, tab bar: px-12 py-4, gap-8, rounded-70 */
/* ------------------------------------------------------------------ */

export interface BottomBarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface BottomBarProps {
  items?: BottomBarItem[];
  activeId?: string;
  onTabPress?: (id: string) => void;
  /** Optional live activity banner above the bar */
  liveActivity?: React.ReactNode;
  className?: string;
}

const defaultItems: BottomBarItem[] = [
  { id: "home", label: "Home", icon: <Home className="h-24 w-24" /> },
  { id: "send", label: "Send", icon: <Send className="h-24 w-24" /> },
  { id: "invest", label: "Invest", icon: <TrendingUp className="h-24 w-24" /> },
  { id: "menu", label: "Menu", icon: <Menu className="h-24 w-24" /> },
];

export function BottomBar({
  items = defaultItems,
  activeId = "home",
  onTabPress,
  liveActivity,
  className,
}: BottomBarProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Live activity slot */}
      {liveActivity && <div className="px-12 pb-4">{liveActivity}</div>}

      {/* Tab bar wrapper */}
      <div className="px-12 py-6">
        <div className="flex items-center gap-8 rounded-[70px] bg-surface-secondary px-12 py-4">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                onClick={() => onTabPress?.(item.id)}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-4 px-16 py-4 rounded-[60px] transition-colors",
                  isActive && "bg-surface-primary"
                )}
              >
                <div
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-on-surface-primary"
                      : "text-on-surface-tertiary"
                  )}
                >
                  {item.icon}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium leading-[12px] transition-colors",
                    isActive
                      ? "text-on-surface-primary"
                      : "text-on-surface-tertiary"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-2">
        <div className="h-[5px] w-[134px] rounded-full bg-on-surface-primary" />
      </div>
    </div>
  );
}
