"use client";

import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectContextValue {
  closeSelect: () => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
  floatingStyle: React.CSSProperties | null;
  open: boolean;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  registerOption: (option: SelectOption) => void;
  updateFloatingStyle: () => void;
  value: string;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("Select compound components must be used within <Select>");
  return ctx;
}

interface SelectProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  placeholder?: string;
}

function Select({
  id,
  value,
  onValueChange,
  children,
  className,
  triggerClassName,
  disabled,
  placeholder = "请选择",
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<SelectOption[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [floatingStyle, setFloatingStyle] = React.useState<React.CSSProperties | null>(null);

  const updateFloatingStyle = React.useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const gap = 6;
    const viewportPadding = 16;
    const preferredMaxHeight = 240;
    const availableBelow = window.innerHeight - rect.bottom - viewportPadding;
    const availableAbove = rect.top - viewportPadding;
    const openAbove = availableBelow < 180 && availableAbove > availableBelow;
    const availableSpace = openAbove ? availableAbove : availableBelow;

    setFloatingStyle({
      left: rect.left,
      maxHeight: Math.min(preferredMaxHeight, Math.max(128, availableSpace - gap)),
      top: openAbove ? rect.top - gap : rect.bottom + gap,
      transform: openAbove ? "translateY(-100%)" : undefined,
      width: rect.width,
    });
  }, []);

  const closeSelect = React.useCallback(() => {
    setOpen(false);
    setFloatingStyle(null);
  }, []);

  const registerOption = React.useCallback((option: SelectOption) => {
    setOptions((prev) => {
      if (prev.some((o) => o.value === option.value)) return prev;
      return [...prev, option];
    });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      const clickedTrigger = containerRef.current?.contains(target);
      const clickedContent = contentRef.current?.contains(target);

      if (!clickedTrigger && !clickedContent) {
        closeSelect();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [closeSelect, open]);

  React.useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeSelect();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [closeSelect, open]);

  React.useEffect(() => {
    if (!open) return;

    window.addEventListener("resize", updateFloatingStyle);
    window.addEventListener("scroll", updateFloatingStyle, true);

    return () => {
      window.removeEventListener("resize", updateFloatingStyle);
      window.removeEventListener("scroll", updateFloatingStyle, true);
    };
  }, [open, updateFloatingStyle]);

  const selected = options.find((o) => o.value === value);

  const ctx = React.useMemo(
    () => ({
      closeSelect,
      contentRef,
      floatingStyle,
      open,
      onValueChange,
      options,
      registerOption,
      updateFloatingStyle,
      value,
    }),
    [closeSelect, floatingStyle, open, onValueChange, options, registerOption, updateFloatingStyle, value],
  );

  return (
    <SelectContext.Provider value={ctx}>
      <div ref={containerRef} className={cn("relative w-full", className)}>
        <button
          ref={triggerRef}
          id={id}
          type="button"
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => {
            if (!open) {
              updateFloatingStyle();
              setOpen(true);
              return;
            }

            closeSelect();
          }}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-xl border border-border/50 bg-muted/40 px-3 py-2 text-sm shadow-sm transition-all",
            "focus-visible:border-orange-500/40 focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20",
            "dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus-visible:border-orange-500/40 dark:focus-visible:bg-white/[0.06]",
            disabled && "cursor-not-allowed opacity-50",
            open && "border-orange-500/40 bg-background ring-2 ring-orange-500/20 dark:bg-white/[0.06]",
            triggerClassName,
          )}
        >
          <span className={cn("truncate", !selected && "text-muted-foreground/50")}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

function SelectContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { contentRef, floatingStyle, open } = useSelectContext();

  if (!open) {
    return <div className="hidden">{children}</div>;
  }

  if (!floatingStyle) {
    return null;
  }

  return createPortal(
    <div
      ref={contentRef}
      className={cn(
        "fixed z-[9999] overflow-auto rounded-xl border border-border/50 bg-background/95 p-1 shadow-lg backdrop-blur-xl",
        "dark:border-white/[0.08] dark:bg-[rgba(10,10,10,0.95)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]",
        className,
      )}
      role="listbox"
      style={floatingStyle}
    >
      {children}
    </div>,
    document.body,
  );
}

interface SelectOptionProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function SelectOption({ value: optValue, children, disabled }: SelectOptionProps) {
  const { closeSelect, value, onValueChange, registerOption } = useSelectContext();
  const isActive = value === optValue;

  React.useEffect(() => {
    registerOption({ label: typeof children === "string" ? children : optValue, value: optValue, disabled });
  }, [optValue, children, disabled, registerOption]);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onValueChange(optValue);
          closeSelect();
        }
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
        isActive
          ? "bg-orange-500/10 text-foreground font-medium"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground dark:hover:bg-white/[0.06]",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span className="flex-1 truncate">{children}</span>
      {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-orange-500" aria-hidden="true" />}
    </button>
  );
}

Select.Content = SelectContent;
Select.Option = SelectOption;

export { Select };
export type { SelectProps, SelectOption };
