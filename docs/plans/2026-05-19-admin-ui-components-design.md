# Admin UI Components Design

## Goal

Add a small reusable component layer for common admin forms and feedback while preserving the current `thesvg`-aligned WeBase visual style.

## Scope

Build a component library plus a visual example page:

- Form components: `Select`, `Checkbox`, `Switch`, `RadioGroup`, `FormField`
- Feedback components: `Toast`, `ToastProvider`, `ConfirmDialog`
- Example page: `/system/components`
- Navigation entry for the component page
- Minimal production usage:
  - Replace user/role/menu delete `window.confirm` calls with `ConfirmDialog`
  - Use `Toast` for create, edit, delete, status-toggle, and error feedback on user/role/menu pages

Out of scope:

- Full rewrite of existing user, role, menu, or settings forms
- Third-party UI libraries
- Global imperative confirm API
- Backend persistence changes

## Visual Direction

Components must match the existing WeBase shell:

- Neutral OKLCH tokens from `globals.css`
- Rounded `xl` / `2xl` controls
- Thin `border-border/40` and `dark:border-white/[0.06]` borders
- `bg-muted/40`, `bg-card/80`, and translucent panel layers
- Orange only for emphasized action or selected state
- Subtle hover, focus-visible rings, and low-shadow surfaces

## Architecture

Add focused primitives under `src/components/ui/`:

- `select.tsx`: styled native select wrapper with label-friendly sizing
- `checkbox.tsx`: accessible checkbox with optional controlled state
- `switch.tsx`: button-based ARIA switch
- `radio-group.tsx`: controlled radio group with item cards
- `form-field.tsx`: shared label, hint, error, and field layout
- `toast.tsx`: toast data types and toast viewport/item rendering
- `toast-provider.tsx`: client provider and `useToast()` hook
- `confirm-dialog.tsx`: controlled confirmation dialog built on existing `Dialog`

Add `ToastProvider` to `src/app/layout.tsx` so pages can call `useToast()`.

Add `src/app/system/components/page.tsx` as the visual acceptance surface. It should show default, selected, disabled, hint, error, toast, and confirm states.

## Data Flow

`ToastProvider` owns an in-memory toast list. `useToast()` exposes `toast({ title, description, variant })` and `dismiss(id)`.

`ConfirmDialog` remains controlled by each page:

- Page stores pending record in state
- Dialog opens when a destructive action is requested
- Confirm button runs the existing delete handler
- Dialog closes after completion

## Error Handling

Keep validation at UI boundaries only:

- Form components expose error presentation but do not own validation rules
- Toast variants cover `default`, `success`, and `destructive`
- ConfirmDialog disables actions while a destructive operation is pending

## Testing and Acceptance

Implementation is complete when:

- `npm run lint` passes
- `npm run build` passes
- Routes return 200 for `/system/components`, `/system/users`, `/system/roles`, `/system/menus`
- Browser visual evidence confirms the component page matches the existing neutral/orange WeBase style
- Existing CRUD flows still create, update, toggle, and delete mock records

## Principles Applied

- KISS: use native inputs/selects and existing Dialog rather than adding a UI framework
- YAGNI: no full form-page rewrite and no global confirm manager
- DRY: centralize repeated label/hint/error markup in `FormField`
- SOLID: keep each primitive focused on one UI responsibility
