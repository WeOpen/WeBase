"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { MenuRecord, RoleRecord, Status } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export interface RoleFormValues {
  name: string;
  code: string;
  description: string;
  status: Status;
  permissions: string[];
}

interface RoleFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  menus: MenuRecord[];
  initialValues?: RoleRecord | null;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RoleFormValues) => Promise<void> | void;
}

interface RoleFormProps {
  description: string;
  menus: MenuRecord[];
  initialValues?: RoleRecord | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: RoleFormValues) => Promise<void> | void;
}

const emptyValues: RoleFormValues = {
  name: "",
  code: "",
  description: "",
  status: "enabled",
  permissions: [],
};

export function getMenuPermissionKey(menu: MenuRecord) {
  const segment = menu.path.split("/").filter(Boolean).at(-1) ?? menu.id;

  return `${segment}:read`;
}

function getInitialValues(role?: RoleRecord | null, menus: MenuRecord[] = []): RoleFormValues {
  if (!role) {
    return emptyValues;
  }

  const hasAllPermissions = role.permissions.includes("*");
  const permissions = hasAllPermissions
    ? menus.map(getMenuPermissionKey)
    : menus
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
        .map(getMenuPermissionKey);

  return {
    name: role.name,
    code: role.code,
    description: role.description,
    status: role.status,
    permissions,
  };
}

function normalizeCode(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}

function RoleForm({
  description,
  menus,
  initialValues,
  submitting,
  onCancel,
  onSubmit,
}: RoleFormProps) {
  const [values, setValues] = React.useState<RoleFormValues>(() => getInitialValues(initialValues, menus));
  const [formError, setFormError] = React.useState<string | null>(null);

  const updateValue = <Key extends keyof RoleFormValues>(key: Key, value: RoleFormValues[Key]) => {
    setFormError(null);
    setValues((current) => ({ ...current, [key]: value }));
  };

  const togglePermission = (permission: string) => {
    setValues((current) => {
      const selected = current.permissions.includes(permission);

      return {
        ...current,
        permissions: selected
          ? current.permissions.filter((item) => item !== permission)
          : [...current.permissions, permission],
      };
    });
  };

  const toggleAllPermissions = () => {
    const allPermissions = menus.map(getMenuPermissionKey);
    const allSelected = allPermissions.every((permission) => values.permissions.includes(permission));

    updateValue("permissions", allSelected ? [] : allPermissions);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = values.name.trim();
    const code = normalizeCode(values.code);
    const description = values.description.trim();

    if (!name || !code || !description) {
      setFormError("Role name, code, and description are required.");
      return;
    }

    await onSubmit({
      name,
      code,
      description,
      status: values.status,
      permissions: values.permissions,
    });
  };

  const selectedCount = values.permissions.length;
  const allSelected = menus.length > 0 && selectedCount === menus.length;

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>

      {formError ? (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {formError}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Role name" htmlFor="role-name">
          <Input
            id="role-name"
            required
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            placeholder="Operations Manager"
            className="bg-background/55"
          />
        </FormField>

        <FormField label="Role code" htmlFor="role-code">
          <Input
            id="role-code"
            required
            value={values.code}
            onChange={(event) => updateValue("code", event.target.value)}
            onBlur={(event) => updateValue("code", normalizeCode(event.target.value))}
            placeholder="OPERATIONS_MANAGER"
            className="bg-background/55 font-mono uppercase tracking-[0.08em]"
          />
        </FormField>

        <FormField label="Status" htmlFor="role-status">
          <Select
            id="role-status"
            value={values.status}
            onValueChange={(value) => updateValue("status", value as Status)}
            triggerClassName="bg-background/70"
          >
            <Select.Content>
              <Select.Option value="enabled">Enabled</Select.Option>
              <Select.Option value="disabled">Disabled</Select.Option>
            </Select.Content>
          </Select>
        </FormField>

        <FormField label="Description" htmlFor="role-description" className="sm:col-span-2">
          <Textarea
            id="role-description"
            required
            value={values.description}
            onChange={(event) => updateValue("description", event.target.value)}
            placeholder="Describe what this role can access."
            className="bg-background/55"
          />
        </FormField>
      </div>

      <section className="rounded-2xl border border-border/50 bg-muted/40 p-4 shadow-inner dark:border-white/[0.06] dark:bg-white/[0.04]">
        <div className="flex flex-col gap-3 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">Menu permissions</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Select menu-level access only. Action-level permissions are intentionally out of scope.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={toggleAllPermissions} disabled={menus.length === 0}>
            {allSelected ? "Clear all" : "Select all"}
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {menus.map((menu) => {
            const permission = getMenuPermissionKey(menu);
            const checked = values.permissions.includes(permission);

            return (
              <label
                key={menu.id}
                className={cn(
                  "group flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                  checked
                    ? "border-orange-200/50 bg-orange-50/80 text-card-foreground dark:border-orange-500/20 dark:bg-orange-500/10"
                    : "border-border/50 bg-card/60 text-muted-foreground hover:border-border hover:bg-accent/50 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.05]",
                )}
              >
                <Checkbox
                  checked={checked}
                  onChange={() => togglePermission(permission)}
                  className="mt-1 bg-background"
                />
                <span>
                  <span className="block text-sm font-medium text-card-foreground">{menu.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{menu.path}</span>
                </span>
              </label>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          {selectedCount} of {menus.length} menus selected.
        </p>
      </section>

      <div className="flex justify-end gap-3 border-t border-border/70 pt-5">
        <Button type="button" variant="outline" disabled={submitting} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save role"}
        </Button>
      </div>
    </form>
  );
}

export function RoleFormDialog({
  open,
  mode,
  menus,
  initialValues,
  submitting = false,
  onOpenChange,
  onSubmit,
}: RoleFormDialogProps) {
  const title = mode === "create" ? "Create role" : "Edit role";
  const description =
    mode === "create"
      ? "Create a local mock role and assign menu-level permissions for this session."
      : "Update the selected role profile and menu access scope.";
  const formKey = `${mode}-${initialValues?.id ?? "new"}-${menus.length}-${open ? "open" : "closed"}`;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      className="border-border/40 bg-card/95 backdrop-blur-xl sm:max-w-3xl dark:border-white/[0.08]"
    >
      <RoleForm
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
