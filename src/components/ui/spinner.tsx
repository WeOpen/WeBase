import * as React from "react";

import { cn } from "@/lib/utils";

const spinnerSizes = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[2.5px]",
  xl: "h-12 w-12 border-[3px]",
} as const;

type SpinnerSize = keyof typeof spinnerSizes;

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  color?: "default" | "primary" | "success" | "warning" | "danger";
  label?: string;
}

const colorMap = {
  default: "border-muted-foreground/20 border-t-foreground",
  primary: "border-primary/20 border-t-primary",
  success: "border-green-500/20 border-t-green-500",
  warning: "border-yellow-500/20 border-t-yellow-500",
  danger: "border-red-500/20 border-t-red-500",
} as const;

function Spinner({ size = "md", color = "default", label, className, ...props }: SpinnerProps) {
  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)} {...props}>
      <div
        className={cn("animate-spin rounded-full", spinnerSizes[size], colorMap[color])}
        role="status"
        aria-label={label ?? "加载中"}
      />
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
}

Spinner.displayName = "Spinner";

export { Spinner };
export type { SpinnerProps, SpinnerSize };
