import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Divider                                                            */
/*  Figma: type "Content" (1px) and "Section" (4px), border-primary    */
/* ------------------------------------------------------------------ */

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** "content" = 1px row separator, "section" = 4px page break */
  type?: "content" | "section";
  /** Inset from the left (e.g. to align with list item content) */
  inset?: number;
}

export function Divider({ type = "content", inset, className, style, ...props }: DividerProps) {
  const isSection = type === "section";
  return (
    <div
      className={cn("bg-border-primary", isSection ? "h-4 w-full" : "h-px w-full", className)}
      style={{ marginLeft: inset ? `${inset}px` : undefined, ...style }}
      role="separator"
      {...props}
    />
  );
}
