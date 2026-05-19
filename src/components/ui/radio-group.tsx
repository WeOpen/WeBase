import * as React from "react";

import { cn } from "@/lib/utils";

type RadioOption = {
  label: React.ReactNode;
  value: string;
  description?: React.ReactNode;
};

type RadioGroupProps = {
  name: string;
  value: string;
  options: RadioOption[];
  onValueChange: (value: string) => void;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

function RadioGroup({
  name,
  value,
  options,
  onValueChange,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={cn("grid gap-2", className)}
    >
      {options.map((option) => {
        const checked = option.value === value;

        return (
          <label
            key={option.value}
            className={cn(
              "group flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
              checked
                ? "border-orange-200/50 bg-orange-50/80 text-card-foreground dark:border-orange-500/20 dark:bg-orange-500/10"
                : "border-border/50 bg-card/60 text-muted-foreground hover:border-border hover:bg-accent/50 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.05]",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onValueChange(option.value)}
              className="mt-1 h-4 w-4 border-border bg-muted/40 accent-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/[0.04]"
            />
            <span>
              <span className="block text-sm font-medium text-card-foreground">{option.label}</span>
              {option.description ? (
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {option.description}
                </span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export { RadioGroup };
export type { RadioGroupProps, RadioOption };
