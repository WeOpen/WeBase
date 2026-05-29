"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface AccordionContextValue {
  expandedKeys: Set<string>;
  toggle: (key: string) => void;
  variant: "default" | "bordered" | "splitted";
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion compound components must be used within <Accordion>");
  return ctx;
}

interface AccordionProps {
  defaultExpandedKeys?: string[];
  expandedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  variant?: "default" | "bordered" | "splitted";
  selectionMode?: "single" | "multiple";
  children: React.ReactNode;
  className?: string;
}

function Accordion({
  defaultExpandedKeys = [],
  expandedKeys: controlledKeys,
  onSelectionChange,
  variant = "default",
  selectionMode = "multiple",
  children,
  className,
}: AccordionProps) {
  const [internalKeys, setInternalKeys] = React.useState(new Set(defaultExpandedKeys));
  const expandedKeys = React.useMemo(
    () => (controlledKeys ? new Set(controlledKeys) : internalKeys),
    [controlledKeys, internalKeys],
  );

  const toggle = React.useCallback(
    (key: string) => {
      setInternalKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          if (selectionMode === "single") next.clear();
          next.add(key);
        }
        onSelectionChange?.(Array.from(next));
        return next;
      });
    },
    [selectionMode, onSelectionChange],
  );

  const value = React.useMemo(() => ({ expandedKeys, toggle, variant }), [expandedKeys, toggle, variant]);

  return (
    <AccordionContext.Provider value={value}>
      <div
        className={cn(
          variant === "default" && "divide-y divide-border/50 rounded-xl border border-border/50 dark:divide-white/[0.06] dark:border-white/[0.06]",
          variant === "bordered" && "space-y-2",
          variant === "splitted" && "space-y-2",
          className,
        )}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  itemKey: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  isDisabled?: boolean;
  className?: string;
}

function AccordionItem({ itemKey, title, subtitle, children, isDisabled, className }: AccordionItemProps) {
  const { expandedKeys, toggle, variant } = useAccordionContext();
  const isExpanded = expandedKeys.has(itemKey);

  return (
    <div
      className={cn(
        variant === "default" && "overflow-hidden",
        variant === "bordered" && "overflow-hidden rounded-xl border border-border/50 dark:border-white/[0.06]",
        variant === "splitted" && "overflow-hidden rounded-xl border border-border/50 shadow-sm dark:border-white/[0.06]",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => !isDisabled && toggle(itemKey)}
        disabled={isDisabled}
        aria-expanded={isExpanded}
        className={cn(
          "flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          !isDisabled && "hover:bg-muted/50 dark:hover:bg-white/[0.04]",
          isDisabled && "cursor-not-allowed opacity-50",
          variant === "splitted" && "bg-card/60 dark:bg-white/[0.02]",
        )}
      >
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-card-foreground">{title}</span>
          {subtitle && <span className="mt-0.5 block text-xs text-muted-foreground">{subtitle}</span>}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-4 pt-1 text-sm leading-6 text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

Accordion.Item = AccordionItem;

export { Accordion };
export type { AccordionProps, AccordionItemProps };
