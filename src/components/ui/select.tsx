import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, disabled, ...props }, ref) => (
    <span className="relative block w-full">
      <select
        ref={ref}
        disabled={disabled}
        className={cn(
          "h-10 w-full appearance-none rounded-xl border border-border/50 bg-muted/40 px-3 py-2 pr-10 text-sm text-foreground shadow-sm transition-all placeholder:text-muted-foreground/50 focus-visible:border-orange-500/40 focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus-visible:bg-white/[0.06]",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60"
        aria-hidden="true"
      />
    </span>
  ),
);

Select.displayName = "Select";

export { Select };
export type { SelectProps };
