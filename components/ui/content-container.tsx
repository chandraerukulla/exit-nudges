import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Content Container (Avatar-like)                                    */
/*  Figma: Content type=Initials|Icon|Flag|Image|Bank × Size=32|40|48|64 */
/*  Circle with optional badge cutout                                  */
/*  Initials: centered text, accent-solid bg                          */
/*  Icon: icon on surface-secondary                                    */
/* ------------------------------------------------------------------ */

const sizeMap = {
  32: {
    dim: "h-32 w-32",
    text: "text-[12px] font-medium leading-[16px]",
    iconSize: "h-16 w-16",
  },
  40: {
    dim: "h-40 w-40",
    text: "text-[16px] font-semibold leading-[24px] tracking-[-0.009em]",
    iconSize: "h-20 w-20",
  },
  48: {
    dim: "h-48 w-48",
    text: "text-[22px] font-semibold leading-[28px] tracking-[-0.017em]",
    iconSize: "h-24 w-24",
  },
  64: {
    dim: "h-64 w-64",
    text: "text-[28px] font-bold leading-[36px] tracking-[-0.01em]",
    iconSize: "h-32 w-32",
  },
} as const;

export interface ContentContainerProps {
  /** Size variant */
  size?: 32 | 40 | 48 | 64;
  /** Initials to show (1-2 characters) */
  initials?: string;
  /** Icon element (overrides initials) */
  icon?: React.ReactNode;
  /** Image src (overrides initials and icon) */
  imageSrc?: string;
  /** Alt text for image */
  imageAlt?: string;
  /** Background color class override */
  bgColor?: string;
  /** Text/icon color class override */
  fgColor?: string;
  /** Badge element to show in cutout */
  badge?: React.ReactNode;
  className?: string;
}

export function ContentContainer({
  size = 40,
  initials,
  icon,
  imageSrc,
  imageAlt = "",
  bgColor,
  fgColor,
  badge,
  className,
}: ContentContainerProps) {
  const s = sizeMap[size];

  return (
    <div className={cn("relative inline-flex shrink-0", s.dim, className)}>
      {/* Main circle */}
      <div
        className={cn(
          "flex items-center justify-center rounded-full overflow-hidden",
          s.dim,
          bgColor ?? (imageSrc ? "bg-surface-secondary" : "bg-accent-solid"),
          fgColor ?? (imageSrc ? "" : "text-accent-on-solid")
        )}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover"
          />
        ) : icon ? (
          <div className={s.iconSize}>{icon}</div>
        ) : (
          <span className={s.text}>
            {initials?.slice(0, 2).toUpperCase() ?? "?"}
          </span>
        )}
      </div>

      {/* Badge overlay */}
      {badge && (
        <div className="absolute -bottom-2 -right-2">{badge}</div>
      )}
    </div>
  );
}
