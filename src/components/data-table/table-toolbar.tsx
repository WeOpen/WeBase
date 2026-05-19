"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TableToolbarStatusOption {
  label: string;
  value: string;
}

export interface TableToolbarProps {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  statusOptions?: TableToolbarStatusOption[];
  action?: React.ReactNode;
  className?: string;
}

const defaultStatusOptions: TableToolbarStatusOption[] = [
  { label: "All statuses", value: "all" },
  { label: "Enabled", value: "enabled" },
  { label: "Disabled", value: "disabled" },
];

export function TableToolbar({
  keyword,
  onKeywordChange,
  status,
  onStatusChange,
  statusOptions = defaultStatusOptions,
  action,
  className,
}: TableToolbarProps) {
  const keywordId = React.useId();
  const statusId = React.useId();

  return (
    <div
      className={cn(
        "admin-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(16rem,22rem)_10rem]">
        <label className="sr-only" htmlFor={keywordId}>
          Search keyword
        </label>
        <Input
          id={keywordId}
          type="search"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="Search by keyword..."
          className="bg-muted/40 dark:bg-white/[0.04]"
        />

        <label className="sr-only" htmlFor={statusId}>
          Filter status
        </label>
        <select
          id={statusId}
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-10 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/[0.04]"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
