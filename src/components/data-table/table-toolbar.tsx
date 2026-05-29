"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
        <Select
          id={statusId}
          value={status}
          onValueChange={onStatusChange}
          triggerClassName="rounded-md"
        >
          <Select.Content>
          {statusOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
          </Select.Content>
        </Select>
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
