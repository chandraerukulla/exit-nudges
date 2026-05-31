import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Circular Loader                                                    */
/*  Figma: Size=Small|Medium|Large|XLarge × Type=Ring|Fill             */
/*  Ring: stroke-based spinner with accent arc                         */
/*  Fill: solid spinner with white progress on dark base               */
/* ------------------------------------------------------------------ */

const sizeMap = {
  small: { dim: 16, stroke: 2, r: 6 },
  medium: { dim: 24, stroke: 2.67, r: 9 },
  large: { dim: 32, stroke: 2.67, r: 13 },
  xlarge: { dim: 40, stroke: 2.67, r: 17 },
} as const;

export interface CircularLoaderProps {
  size?: keyof typeof sizeMap;
  type?: "ring" | "fill";
  className?: string;
}

export function CircularLoader({
  size = "medium",
  type = "ring",
  className,
}: CircularLoaderProps) {
  const { dim, stroke, r } = sizeMap[size];
  const center = dim / 2;
  const circumference = 2 * Math.PI * r;

  if (type === "fill") {
    // Figma: dark base circle + smaller white 270° pie arc
    // Small: 16→14 base, 11 progress  (ratio ≈ 0.786)
    const baseR = (dim - 2) / 2;
    const pR = baseR * (11 / 14); // progress radius from Figma ratio

    // Pie slice: 270° arc starting from top, sweeping clockwise
    const sx = center;
    const sy = center - pR; // start at top
    const ex = center - pR;
    const ey = center; // end at left (270° sweep)

    return (
      <svg
        className={cn("animate-spin", className)}
        width={dim}
        height={dim}
        viewBox={`0 0 ${dim} ${dim}`}
        fill="none"
      >
        <circle cx={center} cy={center} r={baseR} className="fill-surface-contrast" />
        <path
          d={`M ${center} ${center} L ${sx} ${sy} A ${pR} ${pR} 0 1 1 ${ex} ${ey} Z`}
          className="fill-surface-primary"
        />
      </svg>
    );
  }

  return (
    <svg
      className={cn("animate-spin", className)}
      width={dim}
      height={dim}
      viewBox={`0 0 ${dim} ${dim}`}
      fill="none"
    >
      <circle
        cx={center}
        cy={center}
        r={r}
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-surface-primary opacity-30"
      />
      <circle
        cx={center}
        cy={center}
        r={r}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.75}
        className="text-accent-solid"
      />
    </svg>
  );
}
