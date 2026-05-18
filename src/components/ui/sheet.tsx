"use client";

import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

type SheetSide = "left" | "right";

type SheetCommonProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  side?: SheetSide;
};

type SheetAccessibleName =
  | { title: React.ReactNode; ariaLabel?: string }
  | { title?: undefined; ariaLabel: string };

type SheetProps = SheetCommonProps & SheetAccessibleName;

const sideClasses: Record<SheetSide, string> = {
  left: "left-0 border-r",
  right: "right-0 border-l",
};

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.hasAttribute("disabled") && element.tabIndex !== -1,
  );
}

export function Sheet({
  open,
  onOpenChange,
  title,
  ariaLabel,
  children,
  className,
  side = "right",
}: SheetProps) {
  const titleId = React.useId();
  const contentRef = React.useRef<HTMLElement>(null);
  const previousActiveElementRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    previousActiveElementRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusContent = window.setTimeout(() => {
      const content = contentRef.current;

      if (!content) {
        return;
      }

      const [firstFocusable] = getFocusableElements(content);
      (firstFocusable ?? content).focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusContent);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElementRef.current?.focus();
    };
  }, [onOpenChange, open]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") {
      return;
    }

    const content = contentRef.current;

    if (!content) {
      return;
    }

    const focusableElements = getFocusableElements(content);

    if (focusableElements.length === 0) {
      event.preventDefault();
      content.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="关闭抽屉"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <aside
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ? undefined : ariaLabel}
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          "fixed top-0 z-10 h-full w-80 max-w-[85vw] border-border bg-card p-6 text-card-foreground shadow-2xl",
          sideClasses[side],
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? (
            <h2 id={titleId} className="text-lg font-semibold leading-none">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            aria-label="关闭抽屉"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}

export type { SheetProps, SheetSide };
