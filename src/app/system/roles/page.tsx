"use client";

import { KeyRound, Plus, RefreshCw, ShieldCheck, Users } from "lucide-react";
import * as React from "react";

import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { Pagination } from "@/components/data-table/pagination";
import { TableToolbar } from "@/components/data-table/table-toolbar";
import { AppShell } from "@/components/layout/app-shell";
import {
  getMenuPermissionKey,
  RoleFormDialog,
  type RoleFormValues,
} from "@/components/system/role-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MenuRecord, RoleRecord, Status } from "@/lib/api/types";
import { listMenus } from "@/lib/services/menu-service";
import { createRole, deleteRole, listRoles, updateRole } from "@/lib/services/role-service";

const PAGE_SIZE = 8;

type StatusFilter = "all" | Status;

function formatStatus(status: Status) {
  return status === "enabled" ? "Enabled" : "Disabled";
}

function roleMatchesKeyword(role: RoleRecord, keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return true;
  }

  return [role.name, role.code, role.description].some((value) =>
    value.toLowerCase().includes(normalizedKeyword),
  );
}

function rolePermissionCount(role: RoleRecord, menus: MenuRecord[]) {
  if (role.permissions.includes("*")) {
    return menus.length;
  }

  return menus.filter((menu) => {
    const key = getMenuPermissionKey(menu);
    const base = key.split(":")[0];

    return role.permissions.some(
      (permission) =>
        permission === key ||
        permission === menu.id ||
        permission === menu.path ||
        permission.startsWith(`${base}:`),
    );
  }).length;
}

function getPermissionPreview(role: RoleRecord, menus: MenuRecord[]) {
  if (role.permissions.includes("*")) {
    return "All menus";
  }

  const names = menus
    .filter((menu) => {
      const key = getMenuPermissionKey(menu);
      const base = key.split(":")[0];

      return role.permissions.some(
        (permission) =>
          permission === key ||
          permission === menu.id ||
          permission === menu.path ||
          permission.startsWith(`${base}:`),
      );
    })
    .map((menu) => menu.name);

  if (names.length === 0) {
    return "No menus";
  }

  if (names.length <= 2) {
    return names.join(", ");
  }

  return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
}

export default function RolesPage() {
  const [keyword, setKeyword] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [page, setPage] = React.useState(1);
  const [roles, setRoles] = React.useState<RoleRecord[]>([]);
  const [menus, setMenus] = React.useState<MenuRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<RoleRecord | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const enabledMenus = React.useMemo(() => menus.filter((menu) => menu.status === "enabled"), [menus]);

  const filteredRoles = React.useMemo(() => {
    return roles.filter((role) => {
      const matchesKeyword = roleMatchesKeyword(role, keyword);
      const matchesStatus = status === "all" ? true : role.status === status;

      return matchesKeyword && matchesStatus;
    });
  }, [keyword, roles, status]);

  const total = filteredRoles.length;
  const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, maxPage);
  const pagedRoles = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredRoles.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredRoles]);

  const reloadRoles = React.useCallback(async (options?: { preserveMessage?: boolean }) => {
    setLoading(true);
    if (!options?.preserveMessage) {
      setMessage(null);
    }

    try {
      const [roleRecords, menuRecords] = await Promise.all([listRoles(), listMenus()]);
      setRoles(roleRecords);
      setMenus(menuRecords);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;

    void Promise.all([listRoles(), listMenus()])
      .then(([roleRecords, menuRecords]) => {
        if (!active) {
          return;
        }

        setRoles(roleRecords);
        setMenus(menuRecords);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setMessage(error instanceof Error ? error.message : "Failed to load roles.");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const openCreateDialog = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEditDialog = (record: RoleRecord) => {
    setEditing(record);
    setDialogOpen(true);
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as StatusFilter);
    setPage(1);
  };

  const handleSubmit = async (values: RoleFormValues) => {
    setSubmitting(true);
    setMessage(null);

    try {
      if (editing) {
        await updateRole(editing.id, values);
        setMessage("Role updated successfully.");
      } else {
        await createRole({
          ...values,
          userCount: 0,
        });
        setMessage("Role created successfully.");
      }

      setDialogOpen(false);
      setEditing(null);
      await reloadRoles({ preserveMessage: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save role.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (record: RoleRecord) => {
    const nextStatus: Status = record.status === "enabled" ? "disabled" : "enabled";
    setMessage(null);

    try {
      await updateRole(record.id, { status: nextStatus });
      setMessage(`${record.name} is now ${formatStatus(nextStatus).toLowerCase()}.`);
      await reloadRoles({ preserveMessage: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update status.");
    }
  };

  const handleDelete = async (record: RoleRecord) => {
    const confirmed = window.confirm(`Delete role ${record.name}? This action only affects mock data.`);

    if (!confirmed) {
      return;
    }

    setMessage(null);

    try {
      await deleteRole(record.id);
      setMessage("Role deleted successfully.");
      await reloadRoles({ preserveMessage: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete role.");
    }
  };

  const columns: DataTableColumn<RoleRecord>[] = [
    {
      key: "role",
      title: "Role",
      render: (record) => (
        <div>
          <div className="font-medium text-card-foreground">{record.name}</div>
          <div className="mt-1 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
            {record.code}
          </div>
        </div>
      ),
    },
    {
      key: "description",
      title: "Description",
      render: (record) => <span className="text-muted-foreground">{record.description}</span>,
    },
    {
      key: "permissions",
      title: "Menus",
      render: (record) => (
        <div>
          <Badge variant="outline" className="border-orange-200/50 bg-orange-50/80 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
            {rolePermissionCount(record, enabledMenus)} / {enabledMenus.length}
          </Badge>
          <div className="mt-1 text-xs text-muted-foreground">{getPermissionPreview(record, enabledMenus)}</div>
        </div>
      ),
    },
    {
      key: "users",
      title: "Users",
      render: (record) => (
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" aria-hidden="true" />
          {record.userCount}
        </span>
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
                System / Roles
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-card-foreground sm:text-5xl">
                Role permissions with menu-level clarity.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Create, edit, disable, and remove mock roles while assigning only the menus each role can reach.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/50 bg-muted/40 p-4 shadow-inner sm:min-w-72 dark:border-white/[0.06] dark:bg-white/[0.04]">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Roles</p>
                <p className="mt-2 text-2xl font-semibold text-card-foreground">{total}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Menus</p>
                <p className="mt-2 text-2xl font-semibold text-card-foreground">{enabledMenus.length}</p>
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
              <Button variant="outline" onClick={() => void reloadRoles()} disabled={loading}>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Refresh
              </Button>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add role
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
            data={pagedRoles}
            rowKey="id"
            emptyText={loading ? "Loading roles..." : "No roles found."}
          />
          {loading ? (
            <div className="absolute inset-0 grid place-items-center rounded-xl bg-background/45 backdrop-blur-sm">
              <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background/90 dark:border-white/[0.06] dark:bg-black/70 px-4 py-2 text-sm text-muted-foreground shadow-xl">
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading roles
              </div>
            </div>
          ) : null}
        </div>

        <div className="admin-surface flex flex-col gap-3 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-orange-500" aria-hidden="true" />
            Permissions stay menu-level only for this scaffold.
          </span>
          <Pagination page={currentPage} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </div>
      </div>

      <RoleFormDialog
        open={dialogOpen}
        mode={editing ? "edit" : "create"}
        menus={enabledMenus}
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
