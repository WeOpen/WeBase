import * as React from "react";

import { cn } from "@/lib/utils";

const progressSizes = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
} as const;

type ProgressSize = keyof typeof progressSizes;

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  maxValue?: number;
  size?: ProgressSize;
  color?: "default" | "primary" | "success" | "warning" | "danger";
  showValueLabel?: boolean;
  label?: string;
  isIndeterminate?: boolean;
}

const barColors = {
  default: "bg-foreground",
  primary: "bg-primary",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
} as const;

function Progress({
  value = 0,
  maxValue = 100,
  size = "md",
  color = "default",
  showValueLabel = false,
  label,
  isIndeterminate = false,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  return (
    <div className={cn("w-full", className)} {...props}>
      {(label || showValueLabel) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showValueLabel && <span className="font-medium text-foreground">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        aria-label={label}
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted/70 dark:bg-white/[0.06]",
          progressSizes[size],
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            barColors[color],
            isIndeterminate && "animate-progress-indeterminate w-1/3",
          )}
          style={isIndeterminate ? undefined : { width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

Progress.displayName = "Progress";

export { Progress };
export type { ProgressProps, ProgressSize };
