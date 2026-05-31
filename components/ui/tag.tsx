import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Tag                                                                */
/*  Figma: Size=XSmall|Small|Medium|Large                              */
/*         Color=Neutral|Accent|Warning|Success|Error                  */
/*         Type=Solid|Tinted                                           */
/*  Optional leading icon and trailing icon (X dismiss)                */
/* ------------------------------------------------------------------ */

const tagVariants = cva(
  "inline-flex items-center font-medium",
  {
    variants: {
      size: {
        xsmall: "h-20 px-4 gap-4 rounded-4 text-[11px] leading-[16px] tracking-[0.005em]",
        small: "h-24 px-4 gap-4 rounded-4 text-[11px] leading-[16px] tracking-[0.005em]",
        medium: "h-32 px-8 gap-8 rounded-8 text-[12px] leading-[16px]",
        large: "h-40 px-8 gap-8 rounded-8 text-[14px] leading-[20px] tracking-[-0.006em]",
      },
    },
    defaultVariants: {
      size: "small",
    },
  }
);

/* Color × Type → bg + text class */
function colorClasses(
  color: "neutral" | "accent" | "warning" | "success" | "error",
  type: "solid" | "tinted"
) {
  if (type === "tinted") {
    return {
      neutral: "bg-surface-tertiary text-on-surface-primary",
      success: "bg-success-light text-success-on-light",
      warning: "bg-warning-light text-warning-on-light",
      error: "bg-error-light text-error-on-light",
      accent: "bg-accent-light text-accent-on-light",
    }[color];
  }
  // solid
  return {
    neutral: "text-on-surface-primary",
    success: "bg-success-solid text-success-on-solid",
    warning: "bg-warning-solid text-warning-on-solid",
    error: "bg-error-solid text-error-on-solid",
    accent: "bg-accent-solid text-accent-on-solid",
  }[color];
}

const iconSizeMap = {
  xsmall: "h-12 w-12",
  small: "h-12 w-12",
  medium: "h-16 w-16",
  large: "h-16 w-16",
};

export interface TagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof tagVariants> {
  /** Color variant */
  color?: "neutral" | "accent" | "warning" | "success" | "error";
  /** Solid (filled bg) or tinted (light bg) */
  type?: "solid" | "tinted";
  /** Leading icon */
  leadingIcon?: React.ReactNode;
  /** Show trailing dismiss X */
  showTrailingIcon?: boolean;
  /** Called when trailing icon clicked */
  onDismiss?: () => void;
}

export function Tag({
  size = "small",
  color = "neutral",
  type = "solid",
  leadingIcon,
  showTrailingIcon = false,
  onDismiss,
  className,
  children,
  ...props
}: TagProps) {
  const sizeKey = size ?? "small";
  const iconSize = iconSizeMap[sizeKey];

  return (
    <span
      className={cn(
        tagVariants({ size }),
        colorClasses(color, type),
        className
      )}
      {...props}
    >
      {leadingIcon && <span className={cn("shrink-0", iconSize)}>{leadingIcon}</span>}
      <span>{children}</span>
      {showTrailingIcon && (
        <button
          onClick={onDismiss}
          className={cn("shrink-0", iconSize)}
          aria-label="Remove"
        >
          <X className="h-full w-full" />
        </button>
      )}
    </span>
  );
}
