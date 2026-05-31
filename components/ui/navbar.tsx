"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/*  Figma: Type=Page|BottomSheet × Search active=True|False            */
/*  Page: includes status bar space (pt-[62px] on native, but web     */
/*        uses safe-area-inset-top instead)                            */
/*  Action bar: px-16, h-56, horizontal                               */
/*  Leading: 48×48 touch target, 40×40 circle bg-surface-tertiary     */
/*  Title: 16/24 semibold, Subtitle: 12/16 regular secondary          */
/*  Stacked title: 22/28 semibold below action bar                    */
/*  Secondary toolbar: ReactNode slot below stacked title             */
/* ------------------------------------------------------------------ */

export interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page or Bottom sheet context */
  type?: "page" | "bottom-sheet";
  /** Page title */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Show leading back/close button */
  showLeading?: boolean;
  /** Leading icon type */
  leadingIcon?: "back" | "close";
  /** Called when leading button is pressed */
  onLeadingPress?: () => void;
  /** Show inline title in action bar (default true) */
  showMiddle?: boolean;
  /** Trailing action slot */
  trailing?: React.ReactNode;
  /** Show trailing content */
  showTrailing?: boolean;
  /** Show bottom divider */
  showDivider?: boolean;
  /** Stacked large title below action bar */
  stackedTitle?: string;
  /** Optional secondary toolbar content (search, segmented controller, tabs) */
  secondaryToolbar?: React.ReactNode;
  /** Show search in place of title */
  searchActive?: boolean;
  /** Search input content (shown when searchActive is true) */
  searchContent?: React.ReactNode;
}

export function Navbar({
  type = "page",
  title,
  subtitle,
  showLeading = true,
  leadingIcon = "back",
  onLeadingPress,
  showMiddle = true,
  trailing,
  showTrailing = false,
  showDivider = false,
  stackedTitle,
  secondaryToolbar,
  searchActive = false,
  searchContent,
  className,
  ...props
}: NavbarProps) {
  // Figma: search active → always show close (X), otherwise use leadingIcon prop
  const resolvedLeadingIcon = searchActive ? "close" : leadingIcon;
  const LeadingIcon = resolvedLeadingIcon === "close" ? X : ChevronLeft;

  return (
    <div
      className={cn(
        "flex flex-col",
        type === "bottom-sheet" && "pt-16",
        className
      )}
      {...props}
    >
      {/* Action bar */}
      <div className="flex h-[56px] items-center gap-8 px-16">
        {/* Leading button */}
        {showLeading && (
          <button
            onClick={onLeadingPress}
            className="flex h-[48px] w-[48px] shrink-0 items-center justify-center"
            aria-label={resolvedLeadingIcon === "close" ? "Close" : "Go back"}
          >
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-surface-tertiary">
              <LeadingIcon className="h-16 w-16 text-on-surface-primary" />
            </div>
          </button>
        )}

        {/* Middle: title + subtitle OR search content */}
        {searchActive && searchContent ? (
          <div className="flex flex-1 overflow-hidden">{searchContent}</div>
        ) : (
          showMiddle && (
            <div className="flex flex-1 flex-col gap-4 overflow-hidden py-4">
              {title && (
                <span className="truncate text-[16px] font-semibold leading-[24px] tracking-[-0.009em] text-on-surface-primary">
                  {title}
                </span>
              )}
              {subtitle && (
                <span className="truncate text-[12px] font-normal leading-[16px] text-on-surface-secondary">
                  {subtitle}
                </span>
              )}
            </div>
          )
        )}

        {/* Trailing slot */}
        {showTrailing && trailing && (
          <div className="shrink-0">{trailing}</div>
        )}
      </div>

      {/* Stacked title */}
      {stackedTitle && (
        <div className="px-20 pb-8">
          <h1 className="text-[22px] font-semibold leading-[28px] tracking-[-0.013em] text-on-surface-primary">
            {stackedTitle}
          </h1>
        </div>
      )}

      {/* Secondary toolbar */}
      {secondaryToolbar && <div className="px-16">{secondaryToolbar}</div>}

      {/* Divider */}
      {showDivider && <div className="h-px bg-border-primary" />}
    </div>
  );
}
