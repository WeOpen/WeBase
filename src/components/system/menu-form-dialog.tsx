"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { MenuRecord, Status } from "@/lib/api/types";

export interface MenuFormValues {
  name: string;
  parentId?: string;
  path: string;
  icon: string;
  sort: number;
  status: Status;
}

interface MenuFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  menus: MenuRecord[];
  initialValues?: MenuRecord | null;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: MenuFormValues) => Promise<void> | void;
}

interface MenuFormProps {
  description: string;
  menus: MenuRecord[];
  initialValues?: MenuRecord | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: MenuFormValues) => Promise<void> | void;
}

const emptyValues: MenuFormValues = {
  name: "",
  parentId: undefined,
  path: "",
  icon: "Menu",
  sort: 10,
  status: "enabled",
};

function getInitialValues(menu?: MenuRecord | null): MenuFormValues {
  if (!menu) {
    return emptyValues;
  }

  return {
    name: menu.name,
    parentId: menu.parentId,
    path: menu.path,
    icon: menu.icon,
    sort: menu.sort,
    status: menu.status,
  };
}

function MenuForm({
  description,
  menus,
  initialValues,
  submitting,
  onCancel,
  onSubmit,
}: MenuFormProps) {
  const [values, setValues] = React.useState<MenuFormValues>(() => getInitialValues(initialValues));
  const parentOptions = React.useMemo(
    () => menus.filter((menu) => !menu.parentId && menu.id !== initialValues?.id).sort((a, b) => a.sort - b.sort),
    [initialValues?.id, menus],
  );

  const updateValue = <Key extends keyof MenuFormValues>(key: Key, value: MenuFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = values.name.trim();
    const path = values.path.trim();
    const icon = values.icon.trim();

    await onSubmit({
      name,
      parentId: values.parentId || undefined,
      path,
      icon,
      sort: Number.isFinite(values.sort) ? values.sort : 0,
      status: values.status,
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-card-foreground">
          <span>Menu name</span>
          <Input
            required
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            placeholder="Menu Management"
            className="bg-background/55"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-card-foreground">
          <span>Parent menu</span>
          <Select
            value={values.parentId ?? ""}
            onChange={(event) => updateValue("parentId", event.target.value || undefined)}
            className="bg-background/70"
          >
            <option value="">Root menu</option>
            {parentOptions.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.name}
              </option>
            ))}
          </Select>
        </label>

        <label className="space-y-2 text-sm font-medium text-card-foreground sm:col-span-2">
          <span>Path</span>
          <Input
            required
            value={values.path}
            onChange={(event) => updateValue("path", event.target.value)}
            placeholder="/system/menus"
            className="bg-background/55 font-mono"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-card-foreground">
          <span>Icon</span>
          <Input
            required
            value={values.icon}
            onChange={(event) => updateValue("icon", event.target.value)}
            placeholder="Menu"
            className="bg-background/55 font-mono"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-card-foreground">
          <span>Sort</span>
          <Input
            required
            type="number"
            min={0}
            value={values.sort}
            onChange={(event) => updateValue("sort", Number(event.target.value))}
            className="bg-background/55"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-card-foreground">
          <span>Status</span>
          <Select
            value={values.status}
            onChange={(event) => updateValue("status", event.target.value as Status)}
            className="bg-background/70"
          >
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </Select>
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-border/70 pt-5">
        <Button type="button" variant="outline" disabled={submitting} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save menu"}
        </Button>
      </div>
    </form>
  );
}

export function MenuFormDialog({
  open,
  mode,
  menus,
  initialValues,
  submitting = false,
  onOpenChange,
  onSubmit,
}: MenuFormDialogProps) {
  const title = mode === "create" ? "Create menu" : "Edit menu";
  const description =
    mode === "create"
      ? "Add a local mock menu and place it in the one-level system navigation tree."
      : "Update the selected menu label, route, icon, order, parent, and access status.";
  const formKey = `${mode}-${initialValues?.id ?? "new"}-${menus.length}-${open ? "open" : "closed"}`;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      className="border-border/40 bg-card/95 backdrop-blur-xl sm:max-w-2xl dark:border-white/[0.08]"
    >
      <MenuForm
        key={formKey}
        description={description}
        menus={menus}
        initialValues={initialValues}
        submitting={submitting}
        onCancel={() => onOpenChange(false)}
        onSubmit={onSubmit}
      />
    </Dialog>
  );
}
