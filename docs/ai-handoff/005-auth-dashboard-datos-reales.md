# 005 — Fase 3.5: autenticación y dashboard con datos reales

## Objetivo

Añadir autenticación completa (registro/login/logout/sesión) sobre el schema Fase 3A y conectar el dashboard shell a la API real con TanStack Query, sin requerir credenciales externas. Todo verificado verde (lint/typecheck/build/14 tests) y pusheado en `5402496`.

## Realizado

### API (`apps/api`)

- **`services/authService.ts`**: `register`, `login`, `logout`, `getCurrentUser`. Hashing con **bcryptjs** (12 rounds), token de sesión `crypto.randomBytes(32).toString("hex")` (64 hex chars), TTL 30 días. Errores `HttpError` con status (409 email en uso, 401 credenciales/sesión inválidas).
- **`lib/http-error.ts`**: clase `HttpError` + helper `httpError(status, message)` para errores normalizados.
- **`routes/auth.ts`**: `POST /register` (201), `POST /login` (200), `POST /logout` (autenticado, 200 `{ ok: true }`), `GET /me` (autenticado, `{ user }`). Zod en register/login (email, password >= 8, name).
- **`routes/overview.ts` + `services/overviewService.ts`**: `GET /api/overview` → `{ metrics: { projects, completedAnalyses, openIssues, recommendations, avgHealth }, recentProjects, recentActivity }`.
- **Nuevos endpoints globales** (todos autenticados):
  - `GET /api/issues` con query `?category=&severity=` (zod nativeEnum, soporte `query` añadido al middleware `validate`).
  - `GET /api/analyses` (con proyecto y `_count` de issues/recommendations).
  - `GET /api/recommendations`.
- **CRUD proyectos completo**: `PATCH /api/projects/:id` (name/repoUrl/defaultBranch, al menos un campo) y `DELETE /api/projects/:id`.
- `validate` ahora acepta `query` además de `body`/`params`.

### Web (`apps/web`)

- **`lib/api.ts`**: cliente fetch con `NEXT_PUBLIC_API_URL`, `ApiError`, token en `localStorage` (`devpilot-token`), helpers `get`/`post`/`patch`/`del`.
- **`lib/auth.tsx`**: `AuthProvider` + `useAuth` (login/register/logout/refresh, estado user/loading).
- **`lib/providers.tsx`**: `QueryClientProvider` (TanStack Query) + `AuthProvider`. Montado en `app/layout.tsx`.
- **Páginas**: `app/auth/login`, `app/auth/register` con `components/auth/auth-card.tsx` (AuthCard, AuthField, useAuthForm, useRedirectOnSuccess) y layout con `bg-grid`. Estados loading/error, mensajes en español, a11y, `noindex`.
- **Navbar**: `components/auth/nav-actions.tsx` — "Iniciar sesión" si no hay sesión; "Panel de control" + nombre + "Cerrar sesión" con sesión. Desktop y mobile.
- **Dashboard**: `lib/queries.ts` (tipos + hooks con TanStack Query) y `lib/mutations.ts` (create/update/delete project). Las 9 secciones + detalle conectadas:
  - Overview (`useOverview`) con métricas, proyectos y actividad recientes.
  - Projects (`useProjects` + `useCreateProject`/`useDeleteProject`) con formulario "Nuevo proyecto" y botón eliminar.
  - Issues, Security, Testing, Architecture (filtro `category` vía `CategoryIssues`).
  - AI Review (`useRecommendations`).
  - Activity (`useActivity`), Settings (cuenta + logout), detalle (`useProject`).
- **Guard auth**: `DashboardShell` muestra skeleton mientras `loading` y redirige a `/login` si no hay sesión.

## Archivos clave

- `apps/api/src/{routes/auth,overview}.ts` · `services/{authService,overviewService}.ts` · `lib/http-error.ts` · `middleware/validate.ts`
- `apps/web/src/lib/{api,auth,providers,queries,mutations}.{ts,tsx}` · `apps/web/src/app/auth/**` · `apps/web/src/components/auth/**` · `apps/web/src/components/dashboard/category-issues.tsx` · páginas `app/dashboard/**`
- Tests: `apps/api/src/services/authService.test.ts` (8) · `apps/web/src/lib/api.test.ts` (3)

## Decisiones

- **bcryptjs** (puro JS) en lugar de bcrypt/argon2 para evitar compilación nativa en Windows.
- Token de sesión aleatorio en la tabla `Session` (no JWT): logout invalida la sesión por token.
- TanStack Query como capa de datos del dashboard (caché 30s, invalidación tras mutaciones).
- `validate` extendido con `query` para filtros de issues.
- El dashboard redirige a `/login`; las páginas de auth y dashboard son `noindex`.

## Tests

- `npm run lint` (web + api): 0 errores.
- `npm run typecheck` (web + api): 0 errores.
- `npm run build` (web 16 rutas; api): 0 errores.
- `npm test`: 14/14 (web 9 + api 8 — nota: 14 totales; authService.test.ts usa prisma mockeado, sin DB).
- Push `5402496` → `origin/main`.

## Pendientes

- **PEDIR CREDENCIALES al usuario (paso 3)**: Neon `DATABASE_URL` + `DATABASE_URL_UNPOOLED` → `prisma migrate dev` + seed; Vercel Project/Org ID + Token → deploy frontend (decidir backend serverless).
- Conectar dashboard a DB real y verificar los fetch con datos.
- Playwright E2E (registro→login→crear proyecto→análisis).
- Graphify: grafo de arquitectura (Frontend→Backend→Services→Prisma→Neon) en `docs/`.
- Documentar `docs/api` (rutas auth y nuevas) y `docs/testing`.
- Partes 4-10 del master prompt pendientes de entrega para validación.

## Siguiente tarea sugerida

Pedir al usuario las credenciales de Neon y Vercel. Con Neon: ejecutar `prisma migrate dev` y un seed con datos de prueba para poblar el dashboard. Con Vercel: configurar el proyecto y desplegar el frontend (y decidir dónde vive la API).

## Contexto para otra IA

- Identidad: spec sheet light (landing + auth) / instrumento dark (dashboard). Tokens solo en `globals.css`. Reutilizables: `Container, Eyebrow, Button, SectionHeading, CodePanel, cn`, `components/dashboard/*`, `components/auth/*`.
- API: ESM estricto (imports `.js`), errores `{ error: { message } }`, auth Bearer por `Session`, zod en rutas (body/params/query).
- Rutas nuevas importantes para el dashboard: `GET /api/overview`, `GET /api/issues?category=&severity=`, `GET /api/analyses`, `GET /api/recommendations`, `PATCH/DELETE /api/projects/:id`.
- Auth: register/login devuelven `{ user, token }`; el token se guarda en `localStorage("devpilot-token")` y se envía como `Authorization: Bearer <token>`.
- `prisma generate` requiere DATABASE_URL (puede ser dummy). Las migraciones reales requieren Neon.
- `npm test` corre web + api. `npm run build` tarda ~1 min (aumentar timeout del shell).