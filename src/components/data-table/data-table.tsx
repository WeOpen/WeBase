import * as React from "react";

import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  title: string;
  render: (record: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  emptyText?: string;
  rowKey?: keyof T | ((record: T, index: number) => React.Key);
  className?: string;
}

function getRecordKey<T>(
  record: T,
  index: number,
  rowKey?: DataTableProps<T>["rowKey"],
): React.Key {
  if (typeof rowKey === "function") {
    return rowKey(record, index);
  }

  if (rowKey) {
    return String(record[rowKey]);
  }

  return index;
}

export function DataTable<T>({
  columns,
  data,
  emptyText = "No records found.",
  rowKey,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("admin-surface overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-xs uppercase tracking-[0.18em] text-muted-foreground dark:border-white/[0.06] dark:bg-white/[0.03]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-5 py-4 font-semibold"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {data.length > 0 ? (
              data.map((record, index) => (
                <tr
                  key={getRecordKey(record, index, rowKey)}
                  className="transition-colors hover:bg-accent/50 dark:hover:bg-white/[0.05]"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-5 py-4 align-middle text-card-foreground"
                    >
                      {column.render(record)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="px-5 py-12 text-center text-sm text-muted-foreground"
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
