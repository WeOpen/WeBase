# Admin UI Component Rollout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Polish the custom `Select`, replace remaining native controls across the app, expand `/system/components` to cover all custom UI primitives, and remove non-dashboard hero sections.

**Architecture:** Keep native form semantics and enhance the existing UI primitives under `src/components/ui/` instead of introducing a custom select framework. Replace native controls in place while preserving page state, CRUD flows, filters, and mock service behavior. Remove oversized hero sections by moving pages to compact title/action or card-first layouts without adding a page-header abstraction.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, lucide-react, existing WeBase neutral/orange design tokens.

---

## Preconditions

- Work from `D:\willxue\WeOpen\WeBase\.claude\worktrees\webase-admin-template`.
- Do not modify any `thesvg/` path.
- Do not commit generated artifacts such as `.next/`, `.claude/visual-evidence/`, `next-env.d.ts` dev-route churn, or `*.tsbuildinfo`.
- Keep `/dashboard` structure unchanged.
- Use existing primitives where possible: `Button`, `Badge`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `RadioGroup`, `Dialog`, `ConfirmDialog`, `Sheet`, `ToastProvider/useToast`.

---

### Task 1: Polish the custom Select primitive

**Files:**
- Modify: `src/components/ui/select.tsx:1-23`

**Step 1: Run the current Select audit**

Run:

```powershell
git grep -n "type SelectProps\|const Select\|<select" -- src/components/ui/select.tsx
```

Expected: current `Select` is a styled native `<select>` without a custom arrow wrapper.

**Step 2: Enhance `Select` while keeping native semantics**

Replace `src/components/ui/select.tsx` with this shape:

```tsx
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, disabled, ...props }, ref) => (
    <span className="relative block w-full">
      <select
        ref={ref}
        disabled={disabled}
        className={cn(
          "h-10 w-full appearance-none rounded-xl border border-border/50 bg-muted/40 px-3 py-2 pr-10 text-sm text-foreground shadow-sm transition-all placeholder:text-muted-foreground/50 focus-visible:border-orange-500/40 focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus-visible:bg-white/[0.06]",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60"
        aria-hidden="true"
      />
    </span>
  ),
);

Select.displayName = "Select";

export { Select };
export type { SelectProps };
```

Do not add a custom popover/dropdown implementation.

**Step 3: Run verification**

Run:

```powershell
npm run lint
npm run build
```

Expected: both pass, and build still includes `/system/components`.

**Step 4: Commit**

```powershell
git add src/components/ui/select.tsx
git commit -m @'
feat: polish admin select control
'@
```

---

### Task 2: Replace native select and checkbox controls across existing screens

**Files:**
- Modify: `src/components/system/user-form-dialog.tsx:5-147`
- Modify: `src/components/system/role-form-dialog.tsx:5-249`
- Modify: `src/components/system/menu-form-dialog.tsx:5-173`
- Modify: `src/components/data-table/table-toolbar.tsx:5-75`
- Modify: `src/app/system/settings/page.tsx:3-283`
- Modify: `src/app/login/page.tsx:3-177`

**Step 1: Run a failing native-control audit**

Run:

```powershell
git grep -n "<select\|type=\"checkbox\"" -- src/app src/components
```

Expected before implementation: matches remain in form dialogs, table toolbar, settings page, login page, and the primitive implementations themselves.

**Step 2: Replace user form selects**

In `src/components/system/user-form-dialog.tsx`:

- Add import:

```tsx
import { Select } from "@/components/ui/select";
```

- Replace the role `<select>` at `src/components/system/user-form-dialog.tsx:124-134` with:

```tsx
<Select
  value={values.role}
  onChange={(event) => updateValue("role", event.target.value)}
  className="bg-background/55"
>
  {roleOptions.map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ))}
</Select>
```

- Replace the status `<select>` at `src/components/system/user-form-dialog.tsx:139-146` with:

```tsx
<Select
  value={values.status}
  onChange={(event) => updateValue("status", event.target.value as Status)}
  className="bg-background/55"
>
  <option value="enabled">Enabled</option>
  <option value="disabled">Disabled</option>
</Select>
```

**Step 3: Replace role form select and permission checkboxes**

In `src/components/system/role-form-dialog.tsx`:

- Add imports:

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
```

- Replace the status `<select>` at `src/components/system/role-form-dialog.tsx:189-196` with `Select`.
- Replace the permission `<input type="checkbox">` at `src/components/system/role-form-dialog.tsx:239-244` with:

```tsx
<Checkbox
  checked={checked}
  onChange={() => togglePermission(permission)}
  className="mt-1 bg-background"
/>
```

Keep the surrounding styled permission label unchanged.

**Step 4: Replace menu form selects**

In `src/components/system/menu-form-dialog.tsx`:

- Add import:

```tsx
import { Select } from "@/components/ui/select";
```

- Replace parent menu `<select>` at `src/components/system/menu-form-dialog.tsx:115-126` with `Select`.
- Replace status `<select>` at `src/components/system/menu-form-dialog.tsx:165-172` with `Select`.
- Preserve the existing parent filtering logic exactly.

**Step 5: Replace table toolbar select**

In `src/components/data-table/table-toolbar.tsx`:

- Add import:

```tsx
import { Select } from "@/components/ui/select";
```

- Replace the status `<select>` at `src/components/data-table/table-toolbar.tsx:64-75` with:

```tsx
<Select
  id={statusId}
  value={status}
  onChange={(event) => onStatusChange(event.target.value)}
  className="bg-muted/40 dark:bg-white/[0.04]"
>
  {statusOptions.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</Select>
```

**Step 6: Replace settings controls**

In `src/app/system/settings/page.tsx`:

- Add imports:

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
```

- Replace the default theme `<select>` at `src/app/system/settings/page.tsx:206-216` with `Select`.
- Replace notification checkboxes at `src/app/system/settings/page.tsx:264-269` and `src/app/system/settings/page.tsx:277-282` with `Checkbox`.
- Preserve the settings save/load logic and `message` behavior.

**Step 7: Replace login checkbox**

In `src/app/login/page.tsx`:

- Add import:

```tsx
import { Checkbox } from "@/components/ui/checkbox";
```

- Replace the remember-me `<input type="checkbox">` at `src/app/login/page.tsx:169-174` with:

```tsx
<Checkbox
  checked={remember}
  onChange={(event) => setRemember(event.target.checked)}
/>
```

Do not change login validation, password handling, or routing.

**Step 8: Re-run the native-control audit**

Run:

```powershell
git grep -n "<select\|type=\"checkbox\"" -- src/app src/components
```

Expected after implementation: matches should only remain in the primitive implementations:

- `src/components/ui/select.tsx`
- `src/components/ui/checkbox.tsx`

If any non-primitive file still appears, replace that control before continuing.

**Step 9: Run verification**

Run:

```powershell
npm run lint
npm run build
```

Expected: both pass.

**Step 10: Commit**

```powershell
git add src/components/system/user-form-dialog.tsx src/components/system/role-form-dialog.tsx src/components/system/menu-form-dialog.tsx src/components/data-table/table-toolbar.tsx src/app/system/settings/page.tsx src/app/login/page.tsx
git commit -m @'
feat: use custom controls across admin UI
'@
```

---

### Task 3: Remove non-dashboard hero sections

**Files:**
- Modify: `src/app/system/users/page.tsx:292-340`
- Modify: `src/app/system/roles/page.tsx:349-397`
- Modify: `src/app/system/menus/page.tsx:306-354`
- Modify: `src/app/system/settings/page.tsx:132-175`
- Modify: `src/app/system/components/page.tsx:76-107`

**Step 1: Confirm current hero sections**

Run:

```powershell
git grep -n "admin-surface p-6 sm:p-8\|text-3xl font-semibold\|sm:text-5xl" -- src/app/system
```

Expected before implementation: matches in users, roles, menus, settings, and components pages.

**Step 2: Convert users page to compact toolbar-first layout**

In `src/app/system/users/page.tsx`, remove the large `<section className="admin-surface p-6 sm:p-8">...</section>` at `src/app/system/users/page.tsx:295-321`.

Replace the `TableToolbar` action with a two-line action area that keeps record/page context compactly:

```tsx
action={
  <div className="flex flex-wrap items-center justify-end gap-2">
    <span className="rounded-full border border-border/50 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground dark:border-white/[0.06] dark:bg-white/[0.04]">
      {total} records · page {page}
    </span>
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
```

**Step 3: Convert roles and menus pages the same way**

In `src/app/system/roles/page.tsx` and `src/app/system/menus/page.tsx`:

- Remove their large hero `<section className="admin-surface p-6 sm:p-8">...</section>` blocks.
- Keep existing `TableToolbar` as the first visible system-page block.
- Move useful hero stats into compact `action` chips next to refresh/create buttons.
- Do not change CRUD handlers or table columns.

**Step 4: Convert settings page to card-first layout**

In `src/app/system/settings/page.tsx`:

- Remove the top hero `<section className="admin-surface p-6 sm:p-8">...</section>` at `src/app/system/settings/page.tsx:135-161`.
- Keep the message block and settings cards.
- Move current theme/session context into the bottom action surface if needed, using compact text like:

```tsx
<span>Theme: {settings.defaultTheme} · Session: {settings.sessionTimeout}m</span>
```

**Step 5: Convert components page to showcase-first layout**

In `src/app/system/components/page.tsx`:

- Remove the top hero `<section className="admin-surface p-6 sm:p-8">...</section>` at `src/app/system/components/page.tsx:79-105`.
- Add a compact intro row above the grid, not a hero:

```tsx
<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
  <div>
    <p className="text-xs font-medium uppercase tracking-[0.24em] text-orange-600 dark:text-orange-400">
      System / Components
    </p>
    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-card-foreground">
      Component gallery
    </h1>
  </div>
  <Badge variant="outline" className="w-fit bg-muted/40 text-muted-foreground">
    Full custom UI coverage
  </Badge>
</div>
```

This compact header is allowed; it must not use the old large hero typography or stats panel.

**Step 6: Verify dashboard was not changed**

Run:

```powershell
git diff -- src/app/dashboard/page.tsx
```

Expected: no output.

**Step 7: Verify hero class removal**

Run:

```powershell
git grep -n "sm:text-5xl\|admin-surface p-6 sm:p-8" -- src/app/system
```

Expected: no output for `src/app/system/**/page.tsx` unless a future intentional compact page uses a different class. `/dashboard` is outside this grep and remains unchanged.

**Step 8: Run verification**

Run:

```powershell
npm run lint
npm run build
```

Expected: both pass.

**Step 9: Commit**

```powershell
git add src/app/system/users/page.tsx src/app/system/roles/page.tsx src/app/system/menus/page.tsx src/app/system/settings/page.tsx src/app/system/components/page.tsx
git commit -m @'
refactor: remove non-dashboard hero sections
'@
```

---

### Task 4: Expand the component showcase page to cover every custom primitive

**Files:**
- Modify: `src/app/system/components/page.tsx:1-255`

**Step 1: Audit current showcase coverage**

Run:

```powershell
git grep -n "import .*@/components/ui" -- src/app/system/components/page.tsx
```

Expected before implementation: the page imports only a subset of custom primitives and does not showcase `Dialog`, `Sheet`, `Input`, or `Textarea` directly.

**Step 2: Add missing imports and state**

In `src/app/system/components/page.tsx`, add imports:

```tsx
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
```

Add state:

```tsx
const [dialogOpen, setDialogOpen] = React.useState(false);
const [sheetOpen, setSheetOpen] = React.useState(false);
const [sampleName, setSampleName] = React.useState("WeBase Admin");
const [sampleNotes, setSampleNotes] = React.useState("Reusable components stay calm, compact, and accessible.");
```

**Step 3: Update showcase card coverage**

Ensure `/system/components` includes visible examples for all custom UI primitives:

- `Button`: default, outline, destructive, disabled.
- `Badge`: default, outline, destructive.
- `Input`: controlled text input.
- `Textarea`: controlled textarea.
- `Select`: polished native select.
- `Checkbox`: controlled checkbox.
- `Switch`: controlled switch.
- `RadioGroup`: labeled group.
- `Dialog`: a standard non-destructive dialog opened by a button.
- `ConfirmDialog`: existing confirmation flow.
- `Toast`: default, success, destructive trigger buttons.
- `Sheet`: side panel opened by a button.

Keep the page compact after hero removal. Use existing `ShowcaseCard`; do not introduce a new component abstraction unless duplication becomes hard to read.

**Step 4: Add accessible Dialog and Sheet demos**

Use the existing primitives directly:

```tsx
<Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="Standard dialog preview">
  <div className="space-y-4 text-sm text-muted-foreground">
    <p>This dialog demonstrates the base accessible modal primitive.</p>
    <Button onClick={() => setDialogOpen(false)}>Close dialog</Button>
  </div>
</Dialog>

<Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="Admin sheet preview">
  <div className="space-y-4 text-sm text-muted-foreground">
    <p>Sheets keep supporting details available without leaving the current page.</p>
    <Button onClick={() => setSheetOpen(false)}>Close sheet</Button>
  </div>
</Sheet>
```

**Step 5: Run showcase coverage audit**

Run:

```powershell
git grep -n "<Button\|<Badge\|<Input\|<Textarea\|<Select\|<Checkbox\|<Switch\|<RadioGroup\|<Dialog\|<ConfirmDialog\|toast(\|<Sheet" -- src/app/system/components/page.tsx
```

Expected: every listed primitive has at least one match.

**Step 6: Run verification**

Run:

```powershell
npm run lint
npm run build
```

Expected: both pass.

**Step 7: Commit**

```powershell
git add src/app/system/components/page.tsx
git commit -m @'
feat: expand admin component showcase
'@
```

---

### Task 5: Final verification, visual evidence, review, and push

**Files:**
- No source files unless verification reveals a real issue.

**Step 1: Run final static checks**

Run:

```powershell
npm run lint
npm run build
git status --short -- thesvg
git status --short
```

Expected:

- lint passes.
- build passes and includes `/system/components`, `/system/users`, `/system/roles`, `/system/menus`, `/system/settings`, and `/login`.
- `git status --short -- thesvg` has no output.
- no uncommitted source changes.

**Step 2: Capture browser evidence**

Use the existing headless browser evidence approach under `.claude/visual-evidence/` or create a new ignored script there.

Capture screenshots for:

- `/system/components` after showcase expansion.
- `/system/components` with standard `Dialog` open.
- `/system/components` with `Sheet` open.
- `/system/components` with toast visible.
- `/system/users` to confirm hero removal and custom table toolbar select.
- `/system/settings` to confirm hero removal and custom select/checkbox use.
- `/login` to confirm custom checkbox use.

Save all evidence under `.claude/visual-evidence/`; do not commit it.

**Step 3: Request final code review**

Use `superpowers:requesting-code-review` for the range from the design commit to `HEAD`.

Review must check:

- `Select` polish preserves native select accessibility.
- All non-primitive native select/checkbox usage is removed.
- `/system/components` covers every custom primitive.
- Non-dashboard hero sections are removed.
- `/dashboard` was not changed.
- Existing CRUD, settings, login, and filter behavior still work.
- No `thesvg/` changes.

**Step 4: Push when approved**

Run:

```powershell
git push origin worktree-webase-admin-template
```

Expected: push succeeds.

---

## Acceptance Checklist

- [ ] `Select` has custom arrow affordance and polished WeBase styling.
- [ ] Native select/checkbox usage remains only inside `src/components/ui/select.tsx` and `src/components/ui/checkbox.tsx`.
- [ ] `/system/components` demonstrates every custom UI primitive.
- [ ] Users, roles, menus, settings, and components pages no longer use large hero sections.
- [ ] `/dashboard` structure is unchanged.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Browser screenshots are saved under `.claude/visual-evidence/`.
- [ ] Final code review has no Critical or Important issues.
- [ ] Branch is pushed to `origin/worktree-webase-admin-template`.
