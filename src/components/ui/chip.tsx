import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const chipVariants = {
  default: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary text-secondary-foreground border-secondary",
  success: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
  warning: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400",
  danger: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
} as const;

const chipSizes = {
  sm: "h-6 px-2 text-[11px] gap-1",
  md: "h-7 px-2.5 text-xs gap-1.5",
  lg: "h-8 px-3 text-sm gap-1.5",
} as const;

type ChipVariant = keyof typeof chipVariants;
type ChipSize = keyof typeof chipSizes;

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  size?: ChipSize;
  isClosable?: boolean;
  onClose?: () => void;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

function Chip({
  variant = "default",
  size = "md",
  isClosable,
  onClose,
  startContent,
  endContent,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-colors",
        chipVariants[variant],
        chipSizes[size],
        className,
      )}
      {...props}
    >
      {startContent}
      {children}
      {endContent}
      {isClosable && (
        <button
          type="button"
          onClick={onClose}
          className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
          aria-label="移除"
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      )}
    </span>
  );
}

Chip.displayName = "Chip";

export { Chip };
export type { ChipProps, ChipVariant, ChipSize };
