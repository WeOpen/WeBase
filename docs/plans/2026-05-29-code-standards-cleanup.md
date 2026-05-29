# Code Standards Cleanup Implementation Plan

> **For Claude:** Use this plan as the execution checklist for the current cleanup pass.

**Goal:** Add a durable code standard and align the current app with the most important low-risk rules.

**Architecture:** Keep the standards in `docs/code-standards.md`. Move reusable navigation/search data builders into `src/lib/navigation`. Keep UI primitive cleanup behavior-preserving.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Zustand.

---

### Task 1: Document Standards

**Files:**
- Create: `docs/code-standards.md`

**Steps:**
1. Document naming, comments, layering, UI, state, errors, and verification.
2. Keep the standards actionable and specific to this repository.

### Task 2: Fix Layer Boundary

**Files:**
- Create: `src/lib/navigation/global-search.ts`
- Modify: `src/components/layout/global-search-dialog.tsx`
- Modify: `src/components/layout/app-header.tsx`

**Steps:**
1. Move global search result types and builders from the dialog component into `src/lib/navigation/global-search.ts`.
2. Import the shared builder from both header and dialog.
3. Keep UI rendering unchanged.

### Task 3: Remove Decorative Source Comments

**Files:**
- Modify: `src/components/ui/accordion.tsx`
- Modify: `src/components/ui/card.tsx`
- Modify: `src/components/ui/select.tsx`
- Modify: `src/components/ui/tabs.tsx`
- Modify: `src/app/system/components/page.tsx`

**Steps:**
1. Remove banner comments that only restate section names.
2. Keep explanatory comments that document real constraints.

### Task 4: Verify

Run:

```powershell
npm run lint
.\node_modules\.bin\tsc.cmd --noEmit
npm run build
```
