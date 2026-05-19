"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "destructive";

export interface ToastRecord {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

type ToastViewportProps = {
  toasts: ToastRecord[];
  onDismiss: (id: string) => void;
};

const toastIcons: Record<ToastVariant, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  default: Info,
  success: CheckCircle2,
  destructive: XCircle,
};

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6"
    >
      {toasts.map((toast) => {
        const variant = toast.variant ?? "default";
        const Icon = toastIcons[variant];

        return (
          <div
            key={toast.id}
            role={variant === "destructive" ? "alert" : "status"}
            className={cn(
              "admin-surface flex items-start gap-3 p-4 text-sm shadow-2xl backdrop-blur-xl",
              variant === "destructive" && "border-destructive/45 text-destructive",
            )}
          >
            <span
              className={cn(
                "mt-0.5 rounded-full border border-orange-200/50 bg-orange-50/80 p-1 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",
                variant === "destructive" &&
                  "border-destructive/25 bg-destructive/10 text-destructive dark:border-destructive/25 dark:bg-destructive/10 dark:text-destructive",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <p
                className={cn(
                  "font-medium leading-5 text-foreground",
                  variant === "destructive" && "text-destructive",
                )}
              >
                {toast.title}
              </p>
              {toast.description ? (
                <p className="leading-5 text-muted-foreground">{toast.description}</p>
              ) : null}
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="关闭通知"
              className="-mr-2 -mt-2 h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => onDismiss(toast.id)}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
