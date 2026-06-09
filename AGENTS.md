# AGENTS.md

## Project Overview

Library Information System v3 (LIS v3) — a full-stack sample application for managing books, authors, and genres in a library. The repository is a monorepo containing a shared REST API backend and three independent UI clients (Angular, React, Flutter).

## Repository Structure

```
├── packages/
│   ├── api/            # Express + TypeScript REST API (TSOA)
│   ├── angularui/      # Angular 11 web client
│   ├── reactui/        # React 18 web client (CRA)
│   └── flutter/
│       └── bookstore/  # Flutter cross-platform client
├── package.json        # Root workspace config
└── README.md
```

The root `package.json` uses **npm workspaces** to manage `packages/api` and `packages/reactui`. The Angular UI and Flutter app are standalone and not included in the workspace (they have their own `node_modules` / dependency management).

## Packages

### packages/api — REST API

| Aspect | Detail |
|--------|--------|
| Language | TypeScript 5.1 |
| Framework | Express 4.18 |
| Route generation | TSOA 5.1 (decorator-based controllers, auto-generates OpenAPI spec and routes) |
| Data store | LowDB (JSON file-backed, in-memory for sessions) |
| Auth | Bearer token + HTTP Basic (via custom `authentication.ts`) |
| API docs | Swagger UI at `/docs/`, Redoc at `/redoc/` |
| Default port | 5003 (configurable via `NODE_PORT` env var) |

**Key directories:**
- `src/books/` — Book entity, controller, service
- `src/authors/` — Author entity, controller, service
- `src/genres/` — Genre entity, controller, service
- `src/users/` — User entity, controller, service (includes login/logout)
- `src/data/` — Default seed data (users, books, genres, permissions)
- `build/` — Generated output (routes, OpenAPI spec, compiled JS)

**Conventions:**
- Each domain module follows the pattern: `<entity>.ts` (model), `<entity>sController.ts` (TSOA controller), `<entity>sService.ts` (business logic).
- Controllers use TSOA decorators (`@Route`, `@Get`, `@Post`, `@Security`, etc.) for automatic route registration and OpenAPI spec generation.
- The `tsoa.json` config points controller discovery at `src/**/*Controller.ts`.

### packages/angularui — Angular Web Client

| Aspect | Detail |
|--------|--------|
| Framework | Angular 11.2 |
| UI toolkit | Bootstrap 4.6, ng-bootstrap, angular-slickgrid |
| State | Services with RxJS |
| Routing | Angular Router with `AuthGuard` for protected routes |
| Build output | `dist/angularui/` |

**Key directories:**
- `src/app/core/models/` — TypeScript interfaces (Book, Author, Genre)
- `src/app/core/services/` — HTTP services (library, login)
- `src/app/features/` — Feature components (books, authors, admin, home, header, footer)

**Conventions:**
- Feature-based folder structure under `src/app/features/`.
- Each feature entity (books, authors) has list, view, create, and edit sub-components.
- Inline styles, no separate spec files (tests skipped by schematic config).
- Component prefix: `app`.

### packages/reactui — React Web Client

| Aspect | Detail |
|--------|--------|
| Framework | React 18.2 (Create React App) |
| Routing | react-router-dom 6 |
| Proxy | Proxies API calls to `http://localhost:5000` |
| Styling | Custom CSS |

**Key directories:**
- `src/app/pages/` — Page-level components
- `src/app/components/` — Shared/reusable components
- `src/app/http-common.js` — Axios/fetch HTTP configuration
- `src/app/permissions.js` — Client-side permission definitions

### packages/flutter/bookstore — Flutter Client

| Aspect | Detail |
|--------|--------|
| Language | Dart (SDK ≥ 3.0.6) |
| Framework | Flutter |
| Architecture | Feature-based under `lib/src/` |
| State management | get_it (service locator) |
| HTTP | `http` package |

## Authentication & Authorization

The API uses a role-based permission system with three levels:

| Role | Permission Level | Capabilities |
|------|-----------------|--------------|
| Admin | 3 | Full CRUD on all entities + user management |
| Editor | 2 | Create/update/delete books and authors |
| Viewer | 1 | Read-only access to books and authors |

**Auth flow:**
1. Client calls `GET /users/login` with Basic auth credentials.
2. API returns a bearer token.
3. Subsequent requests include `Authorization: Bearer <token>`.
4. `GET /users/logout` invalidates the token.

**Predefined test users:**

| Username | Password | Role |
|----------|----------|------|
| q | q | Admin |
| admin | admin | Admin |
| e | e | Editor |
| librarian | librarian | Editor |
| r | r | Viewer |
| borrower | borrower | Viewer |

## Build & Run

### Prerequisites

- Node.js (LTS recommended)
- npm 7+ (for workspace support)
- Flutter SDK ≥ 3.0.6 (for Flutter client only)

### Full Build (API + React)

```bash
npm install
npm run build --ws
```

### API Only

```bash
npm run build -w @lis/api    # Generates TSOA routes/spec, then compiles TS
npm run start -w @lis/api    # Starts on port 5003
npm run prod -w @lis/api     # Starts on port 5003 (explicit env)
```

**Development mode (with hot reload):**

```bash
npm run dev -w @lis/api      # Uses concurrently + nodemon + tsoa watch
```

### Angular UI

```bash
cd packages/angularui
npm install                  # Or run INSTALL_MODULES.cmd on Windows
npm start                    # ng serve (default port 4200)
npm run build                # Output to dist/angularui/
```

### React UI

```bash
npm start -w @lis/reactui    # Starts CRA dev server (port 3000, proxies to API)
npm run build -w @lis/reactui
```

### Flutter

```bash
cd packages/flutter/bookstore
flutter pub get
flutter run                  # Desktop/mobile
flutter build web            # Web build
```

## Multi-Client Architecture

The API serves multiple UI clients simultaneously. Each client type can be accessed via path-based routing:

- `/reactui/` — React build (static files)
- `/angularui/` — Angular build (static files)
- `/flutter/` — Flutter web build (static files)
- `/api/` — REST API endpoints
- `/docs/` — Swagger UI

Each client session gets its own isolated in-memory database instance (seeded from `defbooks.json` + default users). Persistent client databases can also be stored to disk with a `clientId`.

## API Endpoints

All API routes are under `/api/` and auto-generated by TSOA. Primary resources:

- `GET/POST/PUT/DELETE /api/books` — Book CRUD
- `GET/POST/PUT/DELETE /api/authors` — Author CRUD
- `GET /api/genres` — Genre listing
- `GET /api/users/login` — Authentication
- `GET /api/users/logout` — Session end
- `GET /api/users/test` — Health check (no auth required)

Full interactive docs available at `http://localhost:5003/docs/`.

## Coding Conventions

- **API:** Strict TypeScript (`strict: true`, `noImplicitAny`, `noUnusedLocals`, etc.). Controller/Service separation. TSOA decorators for routing and validation.
- **Angular:** Feature-module folder structure. Inline styles. `app` component prefix. FormsModule for template-driven forms.
- **React:** Functional components (JSX). Page/component separation. Centralized HTTP config.
- **Flutter:** Feature-based `lib/src/` structure. Service locator pattern via `get_it`.

## Local HTTPS with Caddy (Production-like Setup)

To run the app locally at `https://v3.libraryinformationsystem.org` (e.g., for integration testing against the production URL), use Caddy as a local reverse proxy with self-signed TLS.

### Prerequisites

- [Caddy](https://caddyserver.com/download) installed (e.g., `scoop install caddy`)
- Administrator access (for port 443 binding and CA trust installation)
- IIS stopped if running (`iisreset /stop`)

### Setup

**1. Add HOSTS entry** (edit `C:\Windows\System32\drivers\etc\hosts` as Administrator):

```
127.0.0.1 v3.libraryinformationsystem.org
```

**2. The `Caddyfile` in the repo root** is preconfigured:

```
v3.libraryinformationsystem.org {
    tls internal
    reverse_proxy localhost:5003
}
```

`tls internal` tells Caddy to use its own local CA rather than attempting a Let's Encrypt ACME challenge (which would fail since the domain doesn't point to your machine publicly).

**3. Build and start the API:**

```bash
npm install
npm run build --ws
npm run start -w @lis/api
```

**4. Start Caddy** (in an Administrator terminal):

```bash
caddy run
```

On first run, Caddy installs its root CA into the Windows trust store. If prompted, allow it. You can also run `caddy trust` explicitly.

**5. Access the app:**

- `https://v3.libraryinformationsystem.org/reactui/` — React UI
- `https://v3.libraryinformationsystem.org/angularui/` — Angular UI
- `https://v3.libraryinformationsystem.org/api/` — API (Redoc docs)
- `https://v3.libraryinformationsystem.org/docs/` — Swagger UI
- `https://v3.libraryinformationsystem.org/myorg/reactui/` — Org-scoped access

### Traffic Flow

```
Browser/Tests → https://v3.libraryinformationsystem.org:443 (Caddy, TLS) → http://localhost:5003 (Express)
```

### Cleanup

- Stop Caddy: `caddy stop`
- Restart IIS: `iisreset /start`
- Remove the HOSTS entry when done

## Testing

- **API:** No dedicated test runner configured. Use Swagger UI or direct HTTP calls for manual testing.
- **Angular:** Karma + Jasmine configured but tests are generally skipped via schematics config.
- **React:** Jest + React Testing Library available via `npm test -w @lis/reactui`.
- **Flutter:** `flutter_test` and `test` packages available. Run with `flutter test`.
