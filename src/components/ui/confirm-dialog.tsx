"use client";

import { AlertTriangle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

type ConfirmDialogProps = {
  open: boolean;
  title: React.ReactNode;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) {
  const descriptionId = React.useId();

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (loading && !nextOpen) {
        return;
      }

      onOpenChange(nextOpen);
    },
    [loading, onOpenChange],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      ariaDescribedBy={descriptionId}
      className="max-w-md"
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-orange-200/50 bg-orange-50/80 p-4 text-sm text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
          <div className="flex gap-3">
            <span className="mt-0.5 rounded-full border border-orange-200/60 bg-white/70 p-1 text-orange-600 dark:border-orange-500/25 dark:bg-orange-500/10 dark:text-orange-400">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </span>
            <div id={descriptionId} className="leading-6 text-muted-foreground">
              {description}
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "Working..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export type { ConfirmDialogProps };
