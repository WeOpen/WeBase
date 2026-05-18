# WeBase Admin Template Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create an independent WeBase admin-system frontend template in the repository root while using `thesvg/` only as a read-only visual reference.

**Architecture:** Build a fresh Next.js App Router application in `D:/willxue/WeOpen/WeBase`, with reusable admin shell components, mock API services, feature pages, and Tailwind styling inspired by `thesvg`. Do not modify any file under `thesvg/`.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, next-themes, Zustand, lucide-react, local mock services.

---

## Preconditions

- Work from `D:/willxue/WeOpen/WeBase`.
- Treat `D:/willxue/WeOpen/WeBase/thesvg` as read-only reference only.
- Do not create, edit, delete, format, or stage files under `thesvg/`.
- Root directory is not currently a git repository; do not create commits unless the user initializes git and asks for commits.
- Use UTF-8 without BOM for every modified file.
- Do not add a backend, external API dependency, charting library, i18n framework, or permission engine in this iteration.

## Verification Commands

Run these from `D:/willxue/WeOpen/WeBase` after the app is created:

```bash
npm run lint
npm run build
npm run dev
```

Expected final result:

- `npm run lint` passes.
- `npm run build` passes.
- Browser verification passes for `/login`, `/dashboard`, `/system/users`, `/system/roles`, `/system/menus`, `/system/settings`.

---

## Task 1: Initialize Root Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `public/manifest.json`

**Steps:**

1. Create a minimal Next.js App Router project in the WeBase root.
2. Add scripts: `dev`, `build`, `start`, `lint`.
3. Add dependencies: `next`, `react`, `react-dom`, `lucide-react`, `next-themes`, `zustand`, `clsx`, `tailwind-merge`, `class-variance-authority`.
4. Add dev dependencies: `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `eslint`, `eslint-config-next`, `tailwindcss`, `@tailwindcss/postcss`.
5. Configure `@/*` path alias to `./src/*`.
6. Implement `src/app/layout.tsx` with `zh-CN`, `ThemeProvider`, and WeBase metadata.
7. Implement `src/app/page.tsx` redirecting `/` to `/dashboard`.
8. Implement `src/app/globals.css` using Tailwind v4 imports and `thesvg`-inspired tokens: dark-first neutral background, card, border, radius, fade-in animation, reduced-motion guard.
9. Create `public/manifest.json` for WeBase.
10. Run `npm install`.
11. Run `npm run lint` and `npm run build`.

---

## Task 2: Add UI Primitives and Utilities

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/components/theme-provider.tsx`
- Create: `src/components/scroll-to-top.tsx`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/dialog.tsx`
- Create: `src/components/ui/sheet.tsx`
- Create: `src/components/ui/textarea.tsx`

**Steps:**

1. Add `cn()` utility using `clsx` and `tailwind-merge`.
2. Add `ThemeProvider` wrapper using `next-themes`.
3. Add `ScrollToTop` route-change helper or no-op-safe client helper.
4. Implement lightweight shadcn-style primitives with `className` extension support.
5. Keep components simple; avoid Radix dependency unless already needed.
6. Run `npm run lint` and `npm run build`.

---

## Task 3: Add Admin Domain Types, Mock Data, and Services

**Files:**
- Create: `src/lib/api/types.ts`
- Create: `src/lib/api/mock-data.ts`
- Create: `src/lib/api/mock-adapter.ts`
- Create: `src/lib/api/client.ts`
- Create: `src/lib/services/auth-service.ts`
- Create: `src/lib/services/dashboard-service.ts`
- Create: `src/lib/services/user-service.ts`
- Create: `src/lib/services/role-service.ts`
- Create: `src/lib/services/menu-service.ts`
- Create: `src/lib/services/settings-service.ts`

**Steps:**

1. Define shared types: `ApiResponse<T>`, `PageResult<T>`, `CurrentUser`, `LoginPayload`, `LoginResult`, `DashboardMetric`, `ActivityItem`, `UserRecord`, `RoleRecord`, `MenuRecord`, `SystemSettings`.
2. Add small mock datasets for dashboard metrics, activities, users, roles, menus, and settings.
3. Implement `mockGet`, `mockPost`, `mockPut`, `mockDelete` with 150ms artificial delay.
4. Support user search, status filter, and pagination.
5. Add `apiClient` that delegates to the mock adapter.
6. Add services that call `apiClient`, never mock data directly.
7. Run `npm run lint` and `npm run build`.

---

## Task 4: Add Auth and Layout Stores

**Files:**
- Create: `src/lib/stores/auth-store.ts`
- Create: `src/lib/stores/layout-store.ts`

**Steps:**

1. Add Zustand auth store for token, current user, `setSession`, and `logout`.
2. Add Zustand layout store for desktop sidebar and mobile sidebar state.
3. Keep table data and form state out of global stores.
4. Run `npm run lint` and `npm run build`.

---

## Task 5: Build Admin App Shell

**Files:**
- Create: `src/lib/navigation/admin-menu.ts`
- Create: `src/components/layout/app-shell.tsx`
- Create: `src/components/layout/app-header.tsx`
- Create: `src/components/layout/app-sidebar.tsx`
- Create: `src/components/layout/mobile-sidebar.tsx`

**Steps:**

1. Add admin menu config for dashboard, users, roles, menus, settings.
2. Build desktop sidebar with active-route styling.
3. Build mobile sidebar with sheet/drawer behavior.
4. Build sticky floating glass header inspired by `thesvg`: rounded container, border, translucent background, blur, subtle shadow.
5. Header includes mobile menu button, WeBase brand, global search trigger, theme toggle, user chip, logout.
6. AppShell composes header, mobile sidebar, desktop sidebar, and main content.
7. Run `npm run lint` and `npm run build`.

---

## Task 6: Add Login Page

**Files:**
- Create: `src/app/login/page.tsx`

**Steps:**

1. Create a client login page.
2. Use username default `admin` and password default `admin123`.
3. Validate required fields.
4. Call `authService.login()`.
5. Store session in `auth-store` and route to `/dashboard`.
6. Use `thesvg`-inspired dark gradient, glass card, large radius, and refined spacing.
7. Run `npm run lint` and `npm run build`.

---

## Task 7: Add Dashboard Page

**Files:**
- Create: `src/app/dashboard/page.tsx`
- Create: `src/components/dashboard/metric-card.tsx`
- Create: `src/components/dashboard/quick-actions.tsx`
- Create: `src/components/dashboard/activity-list.tsx`

**Steps:**

1. Build metric card component.
2. Build quick actions component linking to users, roles, menus, settings.
3. Build activity list component.
4. Build dashboard page with AppShell, welcome panel, metric grid, quick actions, activities, system health.
5. Use Tailwind-only lightweight trend visuals; do not add chart library.
6. Run `npm run lint` and `npm run build`.

---

## Task 8: Add Shared Data Table Components

**Files:**
- Create: `src/components/data-table/data-table.tsx`
- Create: `src/components/data-table/table-toolbar.tsx`
- Create: `src/components/data-table/pagination.tsx`

**Steps:**

1. Add explicit generic `DataTableColumn<T>` and `DataTable<T>`.
2. Add toolbar with keyword input, status native select, and primary action slot.
3. Add pagination with previous/next and total display.
4. Do not add sorting, resizing, virtualization, or selection in首版.
5. Run `npm run lint` and `npm run build`.

---

## Task 9: Add User Management CRUD Page

**Files:**
- Create: `src/app/system/users/page.tsx`
- Create: `src/components/system/user-form-dialog.tsx`

**Steps:**

1. Build user form dialog for username, name, email, role, status.
2. Build users page as a client page with keyword, status, page, records, total, loading, dialog, and editing state.
3. Load data with `listUsers({ keyword, status, page, pageSize: 8 })`.
4. Implement add, edit, toggle status, and delete confirmation.
5. Run `npm run lint` and `npm run build`.

---

## Task 10: Add Role Permissions Page

**Files:**
- Create: `src/app/system/roles/page.tsx`
- Create: `src/components/system/role-form-dialog.tsx`

**Steps:**

1. Build role form dialog for name, code, description, status, and menu permission checkboxes.
2. Build roles page with AppShell, role table, add/edit/delete actions.
3. Keep permission UI menu-level only.
4. Run `npm run lint` and `npm run build`.

---

## Task 11: Add Menu Management Page

**Files:**
- Create: `src/app/system/menus/page.tsx`
- Create: `src/components/system/menu-form-dialog.tsx`

**Steps:**

1. Build menu form dialog for name, parent menu, path, icon, sort, status.
2. Build a simple one-level flatten helper for tree-like display.
3. Build menus page with AppShell and menu rows indented by level.
4. Run `npm run lint` and `npm run build`.

---

## Task 12: Add System Settings Page

**Files:**
- Create: `src/app/system/settings/page.tsx`

**Steps:**

1. Build settings client page with AppShell.
2. Add cards for base config, security config, and notification config.
3. Load from `getSettings()` and save with `updateSettings()`.
4. Show concise inline success message.
5. Run `npm run lint` and `npm run build`.

---

## Task 13: Add Global Search and Visual Polish

**Files:**
- Modify: `src/components/layout/app-header.tsx`
- Optional Create: `src/components/layout/global-search-dialog.tsx`
- Optional Modify: `src/app/globals.css`

**Steps:**

1. Add search over admin menu, mock users, and mock roles.
2. Add Ctrl/Cmd+K shortcut.
3. Selecting menu result routes to its href.
4. Ensure header, sidebar, cards, dark mode, and mobile drawer match the `thesvg` visual reference.
5. Run `npm run lint` and `npm run build`.

---

## Task 14: Final Verification and README

**Files:**
- Create: `README.md`
- Modify if needed: implementation files from earlier tasks

**Steps:**

1. Write README with project description, tech stack, routes, mock credentials, development commands, and API adapter note.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Run `npm run dev` and browser-check `/login`, `/dashboard`, `/system/users`, `/system/roles`, `/system/menus`, `/system/settings`.
5. Search root project for stale user-facing `theSVG`, `thesvg`, `icon library`, `Submit Icon`, `Browse Icons` references. Do not search or edit inside `thesvg/` for cleanup.

---

## Final Acceptance Checklist

- [ ] `thesvg/` remains unmodified after this clarification.
- [ ] Root WeBase project exists and builds.
- [ ] Product metadata says WeBase.
- [ ] `/` redirects to `/dashboard`.
- [ ] `/login` works with mock credentials.
- [ ] `/dashboard` renders admin metrics and activity cards.
- [ ] `/system/users` supports list/search/filter/pagination/add/edit/status/delete.
- [ ] `/system/roles` supports list and menu-level permission mock editing.
- [ ] `/system/menus` supports tree-like menu display and editing.
- [ ] `/system/settings` supports mock save.
- [ ] Global header, sidebar, mobile drawer, theme toggle, and global search work.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Browser verification passes.
