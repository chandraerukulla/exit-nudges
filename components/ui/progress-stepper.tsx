import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { CircularLoader } from "./circular-loader";

/* ------------------------------------------------------------------ */
/*  Progress Stepper                                                   */
/*  Figma: Vertical steps with connecting lines                        */
/*  Each step: indicator column (16px) + content (list item-like)      */
/*  Status=Completed|InProgress|NotStarted                             */
/* ------------------------------------------------------------------ */

export interface ProgressStep {
  title: string;
  description?: string;
  status: "completed" | "in-progress" | "not-started";
  onPress?: () => void;
}

export interface ProgressStepperProps {
  steps: ProgressStep[];
  className?: string;
}

export function ProgressStepper({ steps, className }: ProgressStepperProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {steps.map((step, i) => (
        <StepRow
          key={i}
          step={step}
          isFirst={i === 0}
          isLast={i === steps.length - 1}
        />
      ))}
    </div>
  );
}

function StepRow({
  step,
  isFirst,
  isLast,
}: {
  step: ProgressStep;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-12">
      {/* Indicator column */}
      <div className="flex w-16 flex-col items-center">
        {/* Top line */}
        <div
          className={cn(
            "w-[3px] flex-1 rounded-b-[2px]",
            isFirst
              ? "bg-transparent"
              : step.status === "not-started"
                ? "bg-border-primary"
                : "bg-on-surface-primary"
          )}
        />
        {/* Status icon */}
        <div className="shrink-0">
          {step.status === "completed" ? (
            <CheckCircle2 className="h-16 w-16 text-success-on-light" />
          ) : step.status === "in-progress" ? (
            <CircularLoader size="small" type="fill" />
          ) : (
            <div className="h-16 w-16 rounded-full border-[3px] border-border-secondary" />
          )}
        </div>
        {/* Bottom line */}
        <div
          className={cn(
            "w-[3px] flex-1 rounded-t-[2px]",
            isLast
              ? "bg-transparent"
              : step.status === "completed"
                ? "bg-on-surface-primary"
                : "bg-border-primary"
          )}
        />
      </div>

      {/* Content */}
      <button
        onClick={step.onPress}
        disabled={!step.onPress}
        className={cn(
          "flex flex-1 items-center gap-16 px-20 py-16 rounded-16 text-left",
          step.status === "in-progress" && "bg-surface-secondary"
        )}
      >
        <div className="flex flex-1 flex-col gap-4">
          <span className="text-[14px] font-medium leading-[20px] tracking-[-0.006em] text-on-surface-primary">
            {step.title}
          </span>
          {step.description && (
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.006em] text-on-surface-secondary">
              {step.description}
            </span>
          )}
        </div>
        {step.status === "in-progress" && step.onPress && (
          <ChevronRight className="h-16 w-16 shrink-0 text-on-surface-tertiary" />
        )}
      </button>
    </div>
  );
}
