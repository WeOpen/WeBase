"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Placement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: React.ReactNode;
  placement?: Placement;
  delay?: number;
  children: React.ReactElement;
  className?: string;
}

const placementStyles: Record<Placement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles: Record<Placement, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-card border-x-transparent border-b-transparent",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-card border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-card border-y-transparent border-r-transparent",
  right: "right-full top-1/2 -translate-y-1/2 border-r-card border-y-transparent border-l-transparent",
};

function Tooltip({ content, placement = "top", delay = 300, children, className }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function show() {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  }

  function hide() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }

  React.useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 whitespace-nowrap rounded-lg border border-border/50 bg-card px-3 py-1.5 text-xs font-medium text-card-foreground shadow-lg backdrop-blur-sm",
            "animate-in fade-in-0 zoom-in-95 data-[placement=top]:slide-in-from-bottom-1 data-[placement=bottom]:slide-in-from-top-1",
            "dark:border-white/[0.08] dark:bg-[rgba(10,10,10,0.95)]",
            placementStyles[placement],
            className,
          )}
        >
          {content}
          <span
            aria-hidden="true"
            className={cn("absolute h-0 w-0 border-[5px]", arrowStyles[placement])}
          />
        </div>
      )}
    </div>
  );
}

Tooltip.displayName = "Tooltip";

export { Tooltip };
export type { TooltipProps, Placement };
