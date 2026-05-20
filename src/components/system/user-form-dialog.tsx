"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Status, UserRecord } from "@/lib/api/types";

export interface UserFormValues {
  username: string;
  name: string;
  email: string;
  role: string;
  status: Status;
}

interface UserFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: UserRecord | null;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
}

interface UserFormProps {
  description: string;
  initialValues?: UserRecord | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
}

const emptyValues: UserFormValues = {
  username: "",
  name: "",
  email: "",
  role: "Operator",
  status: "enabled",
};

const roleOptions = ["Administrator", "Operator", "Auditor", "Developer"];

function getInitialValues(user?: UserRecord | null): UserFormValues {
  if (!user) {
    return emptyValues;
  }

  return {
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

function UserForm({
  description,
  initialValues,
  submitting,
  onCancel,
  onSubmit,
}: UserFormProps) {
  const [values, setValues] = React.useState<UserFormValues>(() => getInitialValues(initialValues));

  const updateValue = <Key extends keyof UserFormValues>(key: Key, value: UserFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      username: values.username.trim(),
      name: values.name.trim(),
      email: values.email.trim(),
      role: values.role,
      status: values.status,
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-card-foreground">
          <span>Username</span>
          <Input
            required
            value={values.username}
            onChange={(event) => updateValue("username", event.target.value)}
            placeholder="webase_admin"
            className="bg-background/55"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-card-foreground">
          <span>Name</span>
          <Input
            required
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            placeholder="WeBase Admin"
            className="bg-background/55"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-card-foreground sm:col-span-2">
          <span>Email</span>
          <Input
            required
            type="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            placeholder="admin@webase.local"
            className="bg-background/55"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-card-foreground">
          <span>Role</span>
          <Select
            value={values.role}
            onChange={(event) => updateValue("role", event.target.value)}
            className="bg-background/70"
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
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
          {submitting ? "Saving..." : "Save user"}
        </Button>
      </div>
    </form>
  );
}

export function UserFormDialog({
  open,
  mode,
  initialValues,
  submitting = false,
  onOpenChange,
  onSubmit,
}: UserFormDialogProps) {
  const title = mode === "create" ? "Create user" : "Edit user";
  const description =
    mode === "create"
      ? "Add a local mock user for this admin template session."
      : "Update the selected user's profile and access status.";
  const formKey = `${mode}-${initialValues?.id ?? "new"}-${open ? "open" : "closed"}`;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      className="border-border/40 bg-card/95 backdrop-blur-xl dark:border-white/[0.08]"
    >
      <UserForm
        key={formKey}
        description={description}
        initialValues={initialValues}
        submitting={submitting}
        onCancel={() => onOpenChange(false)}
        onSubmit={onSubmit}
      />
    </Dialog>
  );
}
