# WeBase Admin Template

WeBase Admin Template is an independent Next.js App Router admin scaffold for building operational management consoles. It includes a polished dark-first login experience, an admin shell, dashboard metrics, local mock CRUD flows, role/menu governance, global search, and system settings.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript 6
- Tailwind CSS 4
- Zustand for lightweight client state
- next-themes for theme handling
- lucide-react for icons
- ESLint 9 with Next.js configuration

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirect entry page for the app shell |
| `/login` | Demo login page |
| `/dashboard` | Admin overview, metrics, activity, and quick actions |
| `/system/users` | Mock user management with filtering and CRUD-style interactions |
| `/system/roles` | Role management and permission assignment |
| `/system/menus` | Menu management for the admin navigation tree |
| `/system/settings` | System profile, theme, session, and notification settings |

## Mock credentials

The login form is prefilled with demo credentials:

- Username: `admin`
- Password: `admin123`

The current mock adapter accepts any non-empty username and password, then returns a local demo session. Use the displayed `admin / admin123` credentials for the intended demo flow.

## Development commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

- `npm run dev` starts the local development server.
- `npm run lint` runs ESLint across the project.
- `npm run build` creates a production Next.js build and verifies buildable routes.
- `npm run start` serves the production build after `npm run build`.

## API adapter note

The app is wired through `src/lib/api/client.ts`, which delegates to the in-memory mock adapter in `src/lib/api/mock-adapter.ts`. Feature services under `src/lib/services/` call this client instead of importing mock data directly, so replacing the mock layer with real HTTP requests should be limited to the API client/adapter boundary while preserving service contracts.

Mock data is stored in memory in `src/lib/api/mock-data.ts`; create, update, and delete interactions are for the current browser session only and are not persisted.
