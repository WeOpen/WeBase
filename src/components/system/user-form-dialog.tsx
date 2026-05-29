"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
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
        <FormField label="Username" htmlFor="user-username">
          <Input
            id="user-username"
            required
            value={values.username}
            onChange={(event) => updateValue("username", event.target.value)}
            placeholder="webase_admin"
            className="bg-background/55"
          />
        </FormField>

        <FormField label="Name" htmlFor="user-name">
          <Input
            id="user-name"
            required
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            placeholder="WeBase Admin"
            className="bg-background/55"
          />
        </FormField>

        <FormField label="Email" htmlFor="user-email" className="sm:col-span-2">
          <Input
            id="user-email"
            required
            type="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            placeholder="admin@webase.local"
            className="bg-background/55"
          />
        </FormField>

        <FormField label="Role" htmlFor="user-role">
          <Select
            id="user-role"
            value={values.role}
            onValueChange={(value) => updateValue("role", value)}
            triggerClassName="bg-background/70"
          >
            <Select.Content>
            {roleOptions.map((role) => (
              <Select.Option key={role} value={role}>
                {role}
              </Select.Option>
            ))}
            </Select.Content>
          </Select>
        </FormField>

        <FormField label="Status" htmlFor="user-status">
          <Select
            id="user-status"
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
