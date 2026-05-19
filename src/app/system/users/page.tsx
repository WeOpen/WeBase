"use client";

import { Plus, RefreshCw, ShieldCheck } from "lucide-react";
import * as React from "react";

import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { Pagination } from "@/components/data-table/pagination";
import { TableToolbar } from "@/components/data-table/table-toolbar";
import { AppShell } from "@/components/layout/app-shell";
import { UserFormDialog, type UserFormValues } from "@/components/system/user-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Status, UserRecord } from "@/lib/api/types";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "@/lib/services/user-service";

const PAGE_SIZE = 8;

type StatusFilter = "all" | Status;

function formatStatus(status: Status) {
  return status === "enabled" ? "Enabled" : "Disabled";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default function UsersPage() {
  const [keyword, setKeyword] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [page, setPage] = React.useState(1);
  const [records, setRecords] = React.useState<UserRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<UserRecord | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const reloadUsers = React.useCallback(async (options?: { preserveMessage?: boolean }) => {
    setLoading(true);
    if (!options?.preserveMessage) {
      setMessage(null);
    }

    try {
      const result = await listUsers({
        keyword,
        status: status === "all" ? undefined : status,
        page,
        pageSize: PAGE_SIZE,
      });

      setRecords(result.list);
      setTotal(result.total);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [keyword, page, status]);

  React.useEffect(() => {
    let active = true;

    void listUsers({
      keyword,
      status: status === "all" ? undefined : status,
      page,
      pageSize: PAGE_SIZE,
    })
      .then((result) => {
        if (!active) {
          return;
        }

        setRecords(result.list);
        setTotal(result.total);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setMessage(error instanceof Error ? error.message : "Failed to load users.");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [keyword, page, status]);

  const openCreateDialog = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEditDialog = (record: UserRecord) => {
    setEditing(record);
    setDialogOpen(true);
  };

  const handleKeywordChange = (value: string) => {
    setLoading(true);
    setKeyword(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setLoading(true);
    setStatus(value as StatusFilter);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setLoading(true);
    setPage(nextPage);
  };

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true);
    setMessage(null);

    try {
      if (editing) {
        await updateUser(editing.id, values);
        setMessage("User updated successfully.");
      } else {
        await createUser({
          ...values,
          createdAt: new Date().toISOString(),
        });
        setMessage("User created successfully.");
      }

      setDialogOpen(false);
      setEditing(null);
      await reloadUsers({ preserveMessage: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (record: UserRecord) => {
    const nextStatus: Status = record.status === "enabled" ? "disabled" : "enabled";
    setMessage(null);

    try {
      await updateUser(record.id, { status: nextStatus });
      setMessage(`${record.name} is now ${formatStatus(nextStatus).toLowerCase()}.`);
      await reloadUsers({ preserveMessage: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update status.");
    }
  };

  const handleDelete = async (record: UserRecord) => {
    const confirmed = window.confirm(`Delete user ${record.name}? This action only affects mock data.`);

    if (!confirmed) {
      return;
    }

    setMessage(null);

    try {
      await deleteUser(record.id);
      setMessage("User deleted successfully.");

      const remainingOnPage = records.length - 1;
      const shouldGoPrevious = remainingOnPage <= 0 && page > 1;

      if (shouldGoPrevious) {
        setLoading(true);
        setPage((current) => current - 1);
      } else {
        await reloadUsers({ preserveMessage: true });
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete user.");
    }
  };

  const columns: DataTableColumn<UserRecord>[] = [
    {
      key: "user",
      title: "User",
      render: (record) => (
        <div>
          <div className="font-medium text-card-foreground">{record.name}</div>
          <div className="mt-1 text-xs text-muted-foreground">@{record.username}</div>
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      render: (record) => <span className="text-muted-foreground">{record.email}</span>,
    },
    {
      key: "role",
      title: "Role",
      render: (record) => (
        <Badge variant="outline" className="border-border/60 bg-muted/60 text-muted-foreground dark:border-white/[0.06] dark:bg-white/[0.04]">
          {record.role}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (record) => (
        <Badge
          variant="outline"
          className={
            record.status === "enabled"
              ? "border-orange-200/50 bg-orange-50/80 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400"
              : "border-border/60 bg-muted/60 text-muted-foreground dark:border-white/[0.06] dark:bg-white/[0.04]"
          }
        >
          {formatStatus(record.status)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Created",
      render: (record) => <span className="text-muted-foreground">{formatDate(record.createdAt)}</span>,
    },
    {
      key: "actions",
      title: "Actions",
      render: (record) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => openEditDialog(record)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(record)}>
            {record.status === "enabled" ? "Disable" : "Enable"}
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="admin-surface p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.28em] text-orange-600 dark:text-orange-400">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                System / Users
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-card-foreground sm:text-5xl">
                User management built for calm control.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Search, filter, create, edit, disable, and remove mock users from a focused local CRUD workspace.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/50 bg-muted/40 p-4 shadow-inner sm:min-w-64 dark:border-white/[0.06] dark:bg-white/[0.04]">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Records</p>
                <p className="mt-2 text-2xl font-semibold text-card-foreground">{total}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Page</p>
                <p className="mt-2 text-2xl font-semibold text-card-foreground">{page}</p>
              </div>
            </div>
          </div>
        </section>

        <TableToolbar
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          status={status}
          onStatusChange={handleStatusChange}
          action={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => void reloadUsers()} disabled={loading}>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Refresh
              </Button>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add user
              </Button>
            </div>
          }
        />

        {message ? (
          <div className="admin-surface flex items-center justify-between gap-3 p-4 text-sm text-muted-foreground">
            <span>{message}</span>
            <Button variant="ghost" size="sm" onClick={() => setMessage(null)}>
              Dismiss
            </Button>
          </div>
        ) : null}

        <div className="relative">
          <DataTable
            columns={columns}
            data={records}
            rowKey="id"
            emptyText={loading ? "Loading users..." : "No users found."}
          />
          {loading ? (
            <div className="absolute inset-0 grid place-items-center rounded-xl bg-background/45 backdrop-blur-sm">
              <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background/90 dark:border-white/[0.06] dark:bg-black/70 px-4 py-2 text-sm text-muted-foreground shadow-xl">
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading users
              </div>
            </div>
          ) : null}
        </div>

        <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={handlePageChange} />
      </div>

      <UserFormDialog
        open={dialogOpen}
        mode={editing ? "edit" : "create"}
        initialValues={editing}
        submitting={submitting}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditing(null);
          }
        }}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
}
