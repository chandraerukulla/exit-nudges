import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Section Header                                                     */
/*  Figma: Size=Default|Small, px-20                                   */
/*  Default: title 22/28 semibold, subtitle 14/20 regular              */
/*  Small: title 16/24 semibold, subtitle 12/16 regular                */
/*  Optional: body text, trailing slot, action, divider, collapsible   */
/* ------------------------------------------------------------------ */

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section title */
  title: string;
  /** Optional subtitle / description */
  subtitle?: string;
  /** Size variant */
  size?: "default" | "small";
  /** Optional trailing action element */
  action?: React.ReactNode;
  /** Optional trailing slot (right side of header) */
  trailing?: React.ReactNode;
  /** Show bottom divider */
  showDivider?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  size = "default",
  action,
  trailing,
  showDivider = false,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn("flex flex-col bg-surface-primary", className)}
      {...props}
    >
      {/* Body */}
      <div className="flex items-start gap-16 px-20 pb-20">
        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <span
            className={cn(
              "truncate font-semibold text-on-surface-primary",
              size === "default"
                ? "text-[22px] leading-[28px] tracking-[-0.017em]"
                : "text-[16px] leading-[24px] tracking-[-0.009em]"
            )}
          >
            {title}
          </span>
          {subtitle && (
            <span
              className={cn(
                "font-normal text-on-surface-tertiary",
                size === "default"
                  ? "text-[14px] leading-[20px] tracking-[-0.006em]"
                  : "text-[12px] leading-[16px]"
              )}
            >
              {subtitle}
            </span>
          )}
        </div>

        {/* Trailing slot */}
        {trailing && <div className="shrink-0">{trailing}</div>}

        {/* Action */}
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Divider */}
      {showDivider && <div className="h-px bg-border-primary" />}
    </div>
  );
}
