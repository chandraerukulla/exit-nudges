"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio } from "@/components/ui/radio";
import { Toggle } from "@/components/ui/toggle";
import { PillButton } from "@/components/ui/pill-button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  List Item                                                          */
/*  Figma node 265:153935                                              */
/*  Type variants: NoAction, Navigation, Button, Radio, Toggle,       */
/*  Checkbox                                                           */
/*  Outer: vertical, px-20                                             */
/*  Body:  horizontal, py-16, gap-16                                   */
/*  Primary:   14/20 medium,  on-surface-primary, tracking -0.6%      */
/*  Secondary: 14/20 regular, on-surface-secondary, tracking -0.6%    */
/*  Tertiary:  12/16 regular, on-surface-secondary                     */
/* ------------------------------------------------------------------ */

export type ListItemType =
  | "no-action"
  | "navigation"
  | "button"
  | "radio"
  | "toggle"
  | "checkbox";

export interface ListItemProps {
  type?: ListItemType;
  /** Leading slot (icon, avatar, etc.) */
  leading?: React.ReactNode;
  /** Primary text */
  title: React.ReactNode;
  /** Secondary text */
  description?: React.ReactNode;
  /** Tertiary text */
  tertiary?: React.ReactNode;
  /** Custom trailing content (overrides type's default trailing) */
  trailing?: React.ReactNode;
  /** Trailing text row 1 (right-aligned) */
  trailingRow1?: React.ReactNode;
  /** Trailing text row 2 (right-aligned) */
  trailingRow2?: React.ReactNode;
  /** Trailing text row 3 (right-aligned) */
  trailingRow3?: React.ReactNode;
  /** Whether to show the leading slot */
  showLeading?: boolean;
  /** Whether to show the bottom divider */
  showDivider?: boolean;
  /** Press handler — used for navigation type or custom press */
  onPress?: () => void;
  /** For radio/toggle/checkbox types */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** For button type */
  buttonLabel?: string;
  onButtonPress?: () => void;
  className?: string;
}

export function ListItem({
  type = "no-action",
  leading,
  title,
  description,
  tertiary,
  trailing,
  trailingRow1,
  trailingRow2,
  trailingRow3,
  showLeading = true,
  showDivider = true,
  onPress,
  checked,
  onCheckedChange,
  buttonLabel,
  onButtonPress,
  className,
}: ListItemProps) {
  /* ---- Trailing area ---- */
  const hasTrailingRows = trailingRow1 || trailingRow2 || trailingRow3;

  const trailingContent = (() => {
    // 1. Custom trailing overrides everything
    if (trailing) return <div className="shrink-0">{trailing}</div>;

    // 2. Trailing text rows
    if (hasTrailingRows) {
      return (
        <div className="flex shrink-0 flex-col items-end gap-2">
          {trailingRow1 && (
            <span className="text-[14px] font-medium leading-[20px] tracking-[-0.006em] text-on-surface-primary">
              {trailingRow1}
            </span>
          )}
          {trailingRow2 && (
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.006em] text-on-surface-secondary">
              {trailingRow2}
            </span>
          )}
          {trailingRow3 && (
            <span className="text-[12px] font-normal leading-[16px] text-on-surface-secondary">
              {trailingRow3}
            </span>
          )}
        </div>
      );
    }

    // 3. Type-based trailing
    switch (type) {
      case "navigation":
        return (
          <ChevronRight className="h-16 w-16 shrink-0 text-on-surface-tertiary" />
        );
      case "button":
        return (
          <PillButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onButtonPress?.();
            }}
          >
            {buttonLabel}
          </PillButton>
        );
      case "radio":
        return (
          <Radio
            checked={checked}
            onChange={() => onCheckedChange?.(!checked)}
          />
        );
      case "toggle":
        return (
          <Toggle
            checked={checked}
            onChange={(val) => onCheckedChange?.(val)}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            checked={checked}
            onChange={(val) => onCheckedChange?.(val)}
          />
        );
      case "no-action":
      default:
        return null;
    }
  })();

  /* ---- Body content ---- */
  const body = (
    <div className="flex items-center gap-16 py-16">
      {/* Leading */}
      {showLeading && leading && (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center text-on-surface-primary">
          {leading}
        </div>
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <span className="text-[14px] font-medium leading-[20px] tracking-[-0.006em] text-on-surface-primary">
          {title}
        </span>
        {description && (
          <span className="text-[14px] font-normal leading-[20px] tracking-[-0.006em] text-on-surface-secondary">
            {description}
          </span>
        )}
        {tertiary && (
          <span className="text-[12px] font-normal leading-[16px] text-on-surface-secondary">
            {tertiary}
          </span>
        )}
      </div>

      {/* Trailing */}
      {trailingContent}
    </div>
  );

  /* ---- Wrapper element ---- */
  const isInteractive = type === "navigation" || !!onPress;

  const handleClick = () => {
    if (type === "radio" || type === "checkbox") {
      onCheckedChange?.(!checked);
    } else if (type === "toggle") {
      // Toggle handles its own click internally
    } else {
      onPress?.();
    }
  };

  return (
    <div className={cn("flex flex-col px-20", className)}>
      {isInteractive ? (
        <button
          type="button"
          onClick={handleClick}
          className="w-full text-left transition-colors hover:bg-overlay-light-hover active:bg-overlay-light-pressed"
        >
          {body}
        </button>
      ) : type === "radio" || type === "checkbox" ? (
        <button
          type="button"
          onClick={handleClick}
          className="w-full text-left"
        >
          {body}
        </button>
      ) : (
        <div>{body}</div>
      )}

      {/* Divider */}
      {showDivider && <div className="h-px bg-border-primary" />}
    </div>
  );
}
