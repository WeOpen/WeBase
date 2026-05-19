"use client";

import { Menu as MenuIcon, Plus, RefreshCw, Route } from "lucide-react";
import * as React from "react";

import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { TableToolbar } from "@/components/data-table/table-toolbar";
import { AppShell } from "@/components/layout/app-shell";
import { MenuFormDialog, type MenuFormValues } from "@/components/system/menu-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast-provider";
import type { MenuRecord, Status } from "@/lib/api/types";
import { createMenu, deleteMenu, listMenus, updateMenu } from "@/lib/services/menu-service";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | Status;

type FlatMenuRecord = MenuRecord & {
  level: number;
  parentName?: string;
};

function formatStatus(status: Status) {
  return status === "enabled" ? "Enabled" : "Disabled";
}

function menuMatchesKeyword(menu: MenuRecord, keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return true;
  }

  return [menu.name, menu.path, menu.icon].some((value) => value.toLowerCase().includes(normalizedKeyword));
}

function flattenMenusOneLevel(menus: MenuRecord[]): FlatMenuRecord[] {
  const sortedMenus = [...menus].sort((a, b) => a.sort - b.sort);
  const topLevelMenus = sortedMenus.filter((menu) => !menu.parentId);
  const childMenus = sortedMenus.filter((menu) => menu.parentId);
  const rows: FlatMenuRecord[] = [];
  const usedIds = new Set<string>();

  topLevelMenus.forEach((menu) => {
    rows.push({ ...menu, level: 0 });
    usedIds.add(menu.id);

    childMenus
      .filter((child) => child.parentId === menu.id)
      .forEach((child) => {
        rows.push({ ...child, level: 1, parentName: menu.name });
        usedIds.add(child.id);
      });
  });

  childMenus
    .filter((menu) => !usedIds.has(menu.id))
    .forEach((menu) => rows.push({ ...menu, level: 0 }));

  return rows;
}

export default function MenusPage() {
  const { toast } = useToast();
  const [keyword, setKeyword] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [menus, setMenus] = React.useState<MenuRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<MenuRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<MenuRecord | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const flattenedMenus = React.useMemo(() => flattenMenusOneLevel(menus), [menus]);
  const filteredMenus = React.useMemo(() => {
    return flattenedMenus.filter((menu) => {
      const matchesKeyword = menuMatchesKeyword(menu, keyword);
      const matchesStatus = status === "all" ? true : menu.status === status;

      return matchesKeyword && matchesStatus;
    });
  }, [flattenedMenus, keyword, status]);
  const rootCount = menus.filter((menu) => !menu.parentId).length;
  const childCount = menus.length - rootCount;

  const reloadMenus = React.useCallback(async (options?: { preserveMessage?: boolean }) => {
    setLoading(true);
    if (!options?.preserveMessage) {
      setMessage(null);
    }

    try {
      const records = await listMenus();
      setMenus(records);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load menus.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;

    void listMenus()
      .then((records) => {
        if (!active) {
          return;
        }

        setMenus(records);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setMessage(error instanceof Error ? error.message : "Failed to load menus.");
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

  const openEditDialog = (record: MenuRecord) => {
    setEditing(record);
    setDialogOpen(true);
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as StatusFilter);
  };

  const handleSubmit = async (values: MenuFormValues) => {
    setSubmitting(true);
    setMessage(null);

    try {
      if (editing) {
        await updateMenu(editing.id, values);
        toast({ title: "Menu updated", description: `${values.name} was updated successfully.`, variant: "success" });
      } else {
        await createMenu(values);
        toast({ title: "Menu created", description: `${values.name} was added successfully.`, variant: "success" });
      }

      setDialogOpen(false);
      setEditing(null);
      await reloadMenus({ preserveMessage: true });
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save menu.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (record: MenuRecord) => {
    const nextStatus: Status = record.status === "enabled" ? "disabled" : "enabled";
    setMessage(null);

    try {
      await updateMenu(record.id, { status: nextStatus });
      toast({
        title: "Menu status updated",
        description: `${record.name} is now ${formatStatus(nextStatus).toLowerCase()}.`,
        variant: "success",
      });
      await reloadMenus({ preserveMessage: true });
    } catch (error) {
      toast({
        title: "Status update failed",
        description: error instanceof Error ? error.message : "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);
    setMessage(null);

    try {
      await deleteMenu(deleteTarget.id);
      toast({
        title: "Menu deleted",
        description: `${deleteTarget.name} was removed from mock data.`,
        variant: "success",
      });
      setDeleteTarget(null);
      await reloadMenus({ preserveMessage: true });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete menu.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<FlatMenuRecord>[] = [
    {
      key: "menu",
      title: "Menu",
      render: (record) => (
        <div
          className={cn(
            "flex items-center gap-3",
            record.level === 1 && "pl-6 before:h-px before:w-4 before:bg-border",
          )}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-border/50 bg-muted/50 text-orange-500 shadow-inner dark:border-white/[0.06] dark:bg-white/[0.04]">
            <MenuIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <div className="font-medium text-card-foreground">{record.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {record.level === 1 ? `Child of ${record.parentName ?? "Unknown"}` : "Root menu"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "path",
      title: "Path",
      render: (record) => <span className="font-mono text-xs text-muted-foreground">{record.path}</span>,
    },
    {
      key: "icon",
      title: "Icon",
      render: (record) => (
        <Badge variant="outline" className="border-border/60 bg-muted/60 font-mono text-muted-foreground dark:border-white/[0.06] dark:bg-white/[0.04]">
          {record.icon}
        </Badge>
      ),
    },
    {
      key: "sort",
      title: "Sort",
      render: (record) => <span className="text-muted-foreground">{record.sort}</span>,
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
          <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <TableToolbar
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          status={status}
          onStatusChange={handleStatusChange}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-muted/40 text-muted-foreground">
                {rootCount} root
              </Badge>
              <Badge variant="outline" className="bg-muted/40 text-muted-foreground">
                {childCount} children
              </Badge>
              <Button variant="outline" onClick={() => void reloadMenus()} disabled={loading}>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Refresh
              </Button>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add menu
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
            data={filteredMenus}
            rowKey="id"
            emptyText={loading ? "Loading menus..." : "No menus found."}
          />
          {loading ? (
            <div className="absolute inset-0 grid place-items-center rounded-xl bg-background/45 backdrop-blur-sm">
              <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background/90 dark:border-white/[0.06] dark:bg-black/70 px-4 py-2 text-sm text-muted-foreground shadow-xl">
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading menus
              </div>
            </div>
          ) : null}
        </div>

        <div className="admin-surface flex flex-col gap-3 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <Route className="h-4 w-4 text-orange-500" aria-hidden="true" />
            Showing {filteredMenus.length} of {menus.length} menus in a one-level tree view.
          </span>
          <span>Route convention: /system/menus</span>
        </div>
      </div>

      <MenuFormDialog
        open={dialogOpen}
        mode={editing ? "edit" : "create"}
        menus={menus}
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
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        title="Delete menu"
        description={deleteTarget ? `Delete ${deleteTarget.name}? This action only affects mock data.` : "Delete this menu?"}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleConfirmDelete}
      />
    </AppShell>
  );
}
