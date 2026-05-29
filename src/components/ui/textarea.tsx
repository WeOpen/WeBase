import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-24 w-full resize-y rounded-xl border border-border/50 bg-muted/40 px-3 py-2 text-sm text-foreground shadow-sm transition-all placeholder:text-muted-foreground/50 focus-visible:border-orange-500/40 focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus-visible:border-orange-500/40 dark:focus-visible:bg-white/[0.06]",
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
