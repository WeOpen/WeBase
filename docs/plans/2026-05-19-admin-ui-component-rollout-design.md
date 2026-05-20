# Admin UI Component Rollout Design

## Goal

Polish the custom `Select`, replace remaining native controls with the custom component layer across the app, expand the component showcase to cover every custom UI primitive, and remove page hero sections outside the dashboard.

## Scope

Implement a full-site UI component rollout:

- Enhance `Select` while preserving native `<select>` semantics.
- Replace remaining native `select` usage with `Select`.
- Replace remaining native `checkbox` usage with `Checkbox`.
- Keep `/dashboard` hero/content structure unchanged.
- Remove hero-style top sections from non-dashboard pages and use compact title/action or card-first layouts instead.
- Expand `/system/components` to include all custom UI primitives:
  - `Button`
  - `Badge`
  - `Input`
  - `Textarea`
  - `Select`
  - `Checkbox`
  - `Switch`
  - `RadioGroup`
  - `Dialog`
  - `ConfirmDialog`
  - `Toast`
  - `Sheet`

Out of scope:

- Adding a custom non-native select dropdown.
- Rewriting CRUD logic, mock services, or page data flow.
- Introducing third-party UI libraries.
- Changing the dashboard layout.
- Modifying `thesvg/`.

## Visual Direction

Keep the current WeBase neutral/orange style:

- Rounded `xl` / `2xl` controls.
- Thin neutral borders: `border-border/50`, `dark:border-white/[0.06]`.
- Translucent muted/card layers.
- Orange only for selected states and emphasized actions.
- Compact, shell-aligned page rhythm without large marketing-style hero blocks on system pages.

`Select` should look intentionally designed, not like a plain browser default:

- Native select remains for accessibility.
- A wrapping relative container provides the custom arrow affordance.
- The native arrow is hidden with `appearance-none`.
- Right padding reserves space for the custom icon.
- Focus, disabled, error-compatible, light, and dark states match the existing input system.

## Architecture

Use existing primitives and keep components focused:

- Enhance `src/components/ui/select.tsx` only; no new select framework.
- Reuse `src/components/ui/checkbox.tsx` for all checkbox inputs.
- Keep `FormField` as the shared label/description/error wrapper where forms already have labeled fields.
- Keep page-specific state and submit handlers unchanged.
- Update form dialogs and page controls in place rather than introducing abstractions.

## Page Changes

Replace native controls in:

- `src/components/system/user-form-dialog.tsx`
- `src/components/system/role-form-dialog.tsx`
- `src/components/system/menu-form-dialog.tsx`
- `src/components/data-table/table-toolbar.tsx`
- `src/app/system/settings/page.tsx`
- `src/app/login/page.tsx`

Remove non-dashboard hero sections in:

- `src/app/system/users/page.tsx`
- `src/app/system/roles/page.tsx`
- `src/app/system/menus/page.tsx`
- `src/app/system/settings/page.tsx`
- `src/app/system/components/page.tsx`
- `src/app/login/page.tsx` if it contains a hero-style marketing top section; preserve its auth-centered layout if not applicable.

## Data Flow

No data flow changes are needed.

- Existing form state remains owned by each form dialog/page.
- `Select` receives normal `value`, `onChange`, `disabled`, and `aria-*` props.
- `Checkbox` receives normal controlled or uncontrolled checkbox props.
- Toast and confirm flows from the previous feature remain unchanged.

## Error Handling

Keep validation at current boundaries:

- Existing form validation logic remains in form submit handlers.
- `FormField` continues to display error text where used.
- Component primitives only present state; they do not own validation rules.

## Testing and Acceptance

Implementation is complete when:

- `npm run lint` passes.
- `npm run build` passes.
- Browser visual evidence captures `/system/components` and confirms all custom components are represented.
- `/login`, `/system/users`, `/system/roles`, `/system/menus`, and `/system/settings` still render and their native controls are replaced.
- `/dashboard` remains visually unchanged in structure.
- `git status --short -- thesvg` has no output.

## Principles Applied

- KISS: keep native select/checkbox semantics and avoid custom dropdown complexity.
- YAGNI: do not introduce a page-header abstraction until repeated needs prove it useful.
- DRY: reuse existing `Select`, `Checkbox`, and `FormField` rather than duplicate control styling.
- SOLID: each primitive stays responsible for one UI concern.
