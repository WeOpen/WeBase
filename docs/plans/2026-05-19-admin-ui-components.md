# Admin UI Components Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add reusable admin form and feedback components, a `/system/components` showcase page, and minimal real usage for toast and confirm flows.

**Architecture:** Add focused UI primitives under `src/components/ui/` using native controls and the existing `Dialog` primitive. Wire `ToastProvider` at the app root, expose `useToast()`, and keep `ConfirmDialog` controlled by each page to avoid a global imperative manager.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, lucide-react, existing `cn()` utility, existing WeBase neutral/orange visual system.

---

## Preconditions

- Work from `D:\willxue\WeOpen\WeBase\.claude\worktrees\webase-admin-template`.
- Do not modify `thesvg/`.
- Do not include unrelated generated `next-env.d.ts` changes in commits.
- Use existing style tokens from `src/app/globals.css`.
- Run `npm run lint` and `npm run build` before claiming completion.

---

### Task 1: Add reusable form primitives

**Files:**
- Create: `src/components/ui/form-field.tsx`
- Create: `src/components/ui/select.tsx`
- Create: `src/components/ui/checkbox.tsx`
- Create: `src/components/ui/switch.tsx`
- Create: `src/components/ui/radio-group.tsx`

**Step 1: Create `FormField`**

Implement a small wrapper that centralizes label, description, error, and field spacing.

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, description, error, htmlFor, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-card-foreground">
        {label}
      </label>
      {children}
      {description ? <p className="text-xs leading-5 text-muted-foreground">{description}</p> : null}
      {error ? <p className="text-xs leading-5 text-destructive">{error}</p> : null}
    </div>
  );
}
```

**Step 2: Create `Select`**

Use a styled native `select` to keep accessibility and dependency footprint simple.

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-10 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/[0.04]",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = "Select";

export { Select };
```

**Step 3: Create `Checkbox`**

Use native checkbox with WeBase styling.

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn(
      "h-4 w-4 rounded border-border bg-muted/40 accent-orange-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-white/[0.04]",
      className,
    )}
    {...props}
  />
));

Checkbox.displayName = "Checkbox";

export { Checkbox };
```

**Step 4: Create `Switch`**

Use a button with `role="switch"` and controlled state.

```tsx
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border/60 bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.06] dark:bg-white/[0.06]",
        checked && "border-orange-500/30 bg-orange-500/80 dark:bg-orange-500/70",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none h-5 w-5 rounded-full bg-background shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  ),
);

Switch.displayName = "Switch";

export { Switch };
```

**Step 5: Create `RadioGroup`**

Use semantic radio inputs inside styled labels.

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

interface RadioOption {
  label: React.ReactNode;
  value: string;
  description?: React.ReactNode;
}

interface RadioGroupProps {
  name: string;
  value: string;
  options: RadioOption[];
  onValueChange: (value: string) => void;
  className?: string;
}

export function RadioGroup({ name, value, options, onValueChange, className }: RadioGroupProps) {
  return (
    <div className={cn("grid gap-2", className)} role="radiogroup">
      {options.map((option) => {
        const checked = option.value === value;

        return (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl border border-border/50 bg-card/60 p-3 text-sm transition-colors hover:border-border hover:bg-accent/50 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.05]",
              checked && "border-orange-200/50 bg-orange-50/80 dark:border-orange-500/20 dark:bg-orange-500/10",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onValueChange(option.value)}
              className="mt-1 h-4 w-4 accent-orange-500"
            />
            <span>
              <span className="block font-medium text-card-foreground">{option.label}</span>
              {option.description ? <span className="mt-1 block text-xs text-muted-foreground">{option.description}</span> : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}
```

**Step 6: Run verification**

Run: `npm run lint`

Expected: PASS.

**Step 7: Commit**

```bash
git add src/components/ui/form-field.tsx src/components/ui/select.tsx src/components/ui/checkbox.tsx src/components/ui/switch.tsx src/components/ui/radio-group.tsx
git commit -m "feat: add admin form primitives"
```

---

### Task 2: Add toast and confirm feedback primitives

**Files:**
- Create: `src/components/ui/toast.tsx`
- Create: `src/components/ui/toast-provider.tsx`
- Create: `src/components/ui/confirm-dialog.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create toast renderer**

Create `src/components/ui/toast.tsx`.

```tsx
"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "destructive";

export interface ToastRecord {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastViewportProps {
  toasts: ToastRecord[];
  onDismiss: (id: string) => void;
}

const icons = {
  default: Info,
  success: CheckCircle2,
  destructive: XCircle,
} satisfies Record<ToastVariant, React.ComponentType<React.SVGProps<SVGSVGElement>>>;

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div className="fixed right-3 top-20 z-[60] flex w-[calc(100vw-1.5rem)] max-w-sm flex-col gap-2 sm:right-5" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const variant = toast.variant ?? "default";
        const Icon = icons[variant];

        return (
          <div
            key={toast.id}
            className={cn(
              "admin-surface flex items-start gap-3 p-4 text-sm shadow-xl animate-fade-in-up",
              variant === "success" && "border-orange-200/50 dark:border-orange-500/20",
              variant === "destructive" && "border-destructive/30",
            )}
            role={variant === "destructive" ? "alert" : "status"}
          >
            <Icon className={cn("mt-0.5 h-4 w-4 shrink-0 text-muted-foreground", variant === "success" && "text-orange-500", variant === "destructive" && "text-destructive")} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-card-foreground">{toast.title}</p>
              {toast.description ? <p className="mt-1 leading-5 text-muted-foreground">{toast.description}</p> : null}
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="关闭通知" onClick={() => onDismiss(toast.id)}>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
```

**Step 2: Create toast provider and hook**

Create `src/components/ui/toast-provider.tsx`.

```tsx
"use client";

import * as React from "react";

import { ToastViewport, type ToastRecord } from "@/components/ui/toast";

type ToastInput = Omit<ToastRecord, "id">;

interface ToastContextValue {
  toast: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = React.useCallback((input: ToastInput) => {
    const id = crypto.randomUUID();
    setToasts((current) => [{ id, ...input }, ...current].slice(0, 4));
    window.setTimeout(() => dismiss(id), 4200);
    return id;
  }, [dismiss]);

  const value = React.useMemo(() => ({ toast, dismiss }), [dismiss, toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}
```

**Step 3: Create confirm dialog**

Create `src/components/ui/confirm-dialog.tsx`.

```tsx
"use client";

import { AlertTriangle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} className="border-border/40 bg-card/95 backdrop-blur-xl dark:border-white/[0.08]">
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-2xl border border-orange-200/50 bg-orange-50/80 p-4 text-sm text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="leading-6">{description}</p>
        </div>
        <div className="flex justify-end gap-3 border-t border-border/70 pt-5">
          <Button variant="outline" disabled={loading} onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button variant="destructive" disabled={loading} onClick={onConfirm}>
            {loading ? "Working..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
```

**Step 4: Wire `ToastProvider` in root layout**

Modify `src/app/layout.tsx`.

```tsx
import { ToastProvider } from "@/components/ui/toast-provider";
```

Wrap children inside the theme provider:

```tsx
<ToastProvider>{children}</ToastProvider>
```

**Step 5: Run verification**

Run: `npm run lint`

Expected: PASS.

**Step 6: Commit**

```bash
git add src/components/ui/toast.tsx src/components/ui/toast-provider.tsx src/components/ui/confirm-dialog.tsx src/app/layout.tsx
git commit -m "feat: add admin feedback primitives"
```

---

### Task 3: Add component showcase page and navigation

**Files:**
- Create: `src/app/system/components/page.tsx`
- Modify: `src/lib/navigation/admin-menu.ts`
- Modify: `src/components/layout/app-header.tsx`
- Modify: `src/components/layout/global-search-dialog.tsx`

**Step 1: Add navigation item**

Modify `src/lib/navigation/admin-menu.ts` to import `Blocks` from `lucide-react` and add this item before settings:

```ts
{
  title: "组件示例",
  href: "/system/components",
  icon: Blocks,
},
```

**Step 2: Add top header quick nav item**

Modify the inline nav array in `src/components/layout/app-header.tsx` to include:

```tsx
["/system/components", "组件"],
```

Keep it after menus and before settings if settings is added there later.

**Step 3: Ensure global search includes the new menu**

`GlobalSearchDialog` builds from `adminMenu`, so no special data change is needed beyond the menu item. If the header search has hard-coded quick links, add one quick link for `/system/components` only if it remains visually balanced.

**Step 4: Create showcase page**

Create `src/app/system/components/page.tsx`. It should:

- Use `AppShell`
- Use `FormField`, `Select`, `Checkbox`, `Switch`, `RadioGroup`, `Button`, `ConfirmDialog`, and `useToast`
- Show component states in `admin-surface` cards
- Include buttons that trigger default, success, and destructive toasts
- Include a button that opens confirm dialog

Use this state shape:

```tsx
"use client";

import { Blocks, Bell, CheckCircle2, MousePointerClick, RefreshCw } from "lucide-react";
import * as React from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormField } from "@/components/ui/form-field";
import { RadioGroup } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast-provider";

export default function ComponentsPage() {
  const { toast } = useToast();
  const [role, setRole] = React.useState("operator");
  const [channel, setChannel] = React.useState("email");
  const [enabled, setEnabled] = React.useState(true);
  const [checked, setChecked] = React.useState(true);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="admin-surface p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.28em] text-orange-600 dark:text-orange-400">
                <Blocks className="h-4 w-4" aria-hidden="true" />
                System / Components
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-card-foreground sm:text-5xl">
                Admin components for consistent control surfaces.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Preview reusable form, feedback, and confirmation primitives in the same neutral WeBase visual system.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/50 bg-muted/40 p-4 shadow-inner sm:min-w-72 dark:border-white/[0.06] dark:bg-white/[0.04]">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Primitives</p>
                <p className="mt-2 text-2xl font-semibold text-card-foreground">7</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Style</p>
                <p className="mt-2 text-2xl font-semibold text-card-foreground">1:1</p>
              </div>
            </div>
          </div>
        </section>

        {/* Add cards here for form inputs, choices, feedback, and confirm dialog. */}
      </div>
    </AppShell>
  );
}
```

Fill in the body with cards that exercise each component. Keep the page concise.

**Step 5: Run verification**

Run: `npm run lint && npm run build`

Expected: PASS. Build output includes `/system/components`.

**Step 6: Commit**

```bash
git add src/app/system/components/page.tsx src/lib/navigation/admin-menu.ts src/components/layout/app-header.tsx src/components/layout/global-search-dialog.tsx
git commit -m "feat: add admin component showcase"
```

---

### Task 4: Integrate toast and confirm into CRUD pages

**Files:**
- Modify: `src/app/system/users/page.tsx`
- Modify: `src/app/system/roles/page.tsx`
- Modify: `src/app/system/menus/page.tsx`

**Step 1: Add shared integration pattern to each page**

For each page:

- Import `ConfirmDialog`
- Import `useToast`
- Replace `message` state with toast calls where possible
- Add pending delete state:

```tsx
const { toast } = useToast();
const [deleteTarget, setDeleteTarget] = React.useState<RecordType | null>(null);
const [deleting, setDeleting] = React.useState(false);
```

Keep existing inline `message` only if needed for load errors. Prefer toast for create/edit/delete/toggle feedback.

**Step 2: Replace `window.confirm`**

Change delete button handlers from immediate delete to opening the confirm dialog:

```tsx
<Button variant="destructive" size="sm" onClick={() => setDeleteTarget(record)}>
  Delete
</Button>
```

Add a confirm handler:

```tsx
const handleConfirmDelete = async () => {
  if (!deleteTarget) {
    return;
  }

  setDeleting(true);

  try {
    await deleteUser(deleteTarget.id);
    toast({ title: "User deleted", description: `${deleteTarget.name} was removed from mock data.`, variant: "success" });
    setDeleteTarget(null);
    // Keep existing pagination reload logic.
  } catch (error) {
    toast({ title: "Delete failed", description: error instanceof Error ? error.message : "Failed to delete user.", variant: "destructive" });
  } finally {
    setDeleting(false);
  }
};
```

Adjust names and services for roles and menus.

**Step 3: Add `ConfirmDialog` JSX**

Add below the existing form dialog in each page:

```tsx
<ConfirmDialog
  open={Boolean(deleteTarget)}
  onOpenChange={(open) => {
    if (!open) setDeleteTarget(null);
  }}
  title="Delete user"
  description={deleteTarget ? `Delete ${deleteTarget.name}? This action only affects mock data.` : "Delete this record?"}
  confirmLabel="Delete"
  loading={deleting}
  onConfirm={handleConfirmDelete}
/>
```

**Step 4: Replace success/error `setMessage` calls**

For create/update/toggle/delete success and errors, call `toast()` instead of setting inline message. Keep load errors as inline message if it avoids larger rewrites.

Examples:

```tsx
toast({ title: "User saved", description: "User updated successfully.", variant: "success" });
toast({ title: "Save failed", description: error instanceof Error ? error.message : "Failed to save user.", variant: "destructive" });
```

**Step 5: Run verification**

Run:

```bash
npm run lint && npm run build
```

Expected: PASS.

Probe routes:

```bash
node -e "const http=require('http'); ['/system/components','/system/users','/system/roles','/system/menus'].forEach(p=>http.get({hostname:'127.0.0.1',port:3210,path:p},r=>{console.log(p,r.statusCode); r.resume()}))"
```

Expected: all return `200` if dev server is running.

**Step 6: Commit**

```bash
git add src/app/system/users/page.tsx src/app/system/roles/page.tsx src/app/system/menus/page.tsx
git commit -m "feat: use toast and confirm in CRUD flows"
```

---

### Task 5: Final visual evidence and branch readiness

**Files:**
- No source files unless verification reveals an issue

**Step 1: Run final checks**

```bash
npm run lint && npm run build
git status --short -- thesvg
git status --short
```

Expected:

- lint PASS
- build PASS and includes `/system/components`
- `git status --short -- thesvg` has no output
- no uncommitted source changes except intentionally ignored local artifacts

**Step 2: Capture visual evidence**

Use the existing headless browser approach from the previous visual verification or manually open `/system/components` in the dev server. Capture at least:

- Desktop `/system/components`
- Desktop confirm dialog open state
- Desktop toast visible state

Save evidence outside committed source, under `.claude/visual-evidence/`, which is ignored by `.gitignore`.

**Step 3: Request code review**

Use `requesting-code-review` for the full implementation diff from the design commit to `HEAD`.

Review must check:

- Accessibility of form controls
- Dialog focus behavior
- Toast `aria-live` behavior
- No accidental `thesvg/` edits
- No unrelated `next-env.d.ts` commit
- Existing CRUD behavior still works

**Step 4: Push when approved**

```bash
git push origin worktree-webase-admin-template
```

Expected: push succeeds.
