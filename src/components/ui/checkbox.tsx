import * as React from "react";

import { cn } from "@/lib/utils";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-border bg-muted/40 accent-orange-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/[0.04]",
        className,
      )}
    />
  ),
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps };
