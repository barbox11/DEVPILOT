# DevPilot Project Status

_Updated: 2026-08-14_

## Current phase

Fase 3.6 completada: pulido UI/UX del dashboard tras la auditoría de la Parte 3 (detalle de proyecto con datos reales, flujo IA contextual issue→por qué→análisis→recomendación→fix, estados offline/success con reintento). Todo verde: lint ✓ typecheck ✓ build (16 rutas) ✓ tests 17/17 ✓. Próxima: pedir credenciales Neon/Vercel para migraciones, seed y deploy.

## Overall progress

~52%

## Completed

- Phase 1: monorepo (Next.js 15 web + Express api + Prisma), docs, verified green (commit b293b1f)
- Phase 2: design system + full landing
  - Identity "Diagnostic specification": paper palette (light) + instrument-console dark tokens (.dark)
  - Landing íntegra en español, dark mode, a11y y SEO (commits 13dceb5, 6853687, b13c375, 19a03ca)
- Phase 3 (sin credenciales): a11y/SEO, vitest, CI, schema Prisma (3A), services API (3B), dashboard shell (3C)
- Phase 3.5 (auth + datos reales) — commit `5402496`:
  - **API auth**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`. Hashing bcryptjs (12 rounds), sesión por token aleatorio (crypto.randomBytes 32) con expiración de 30 días en la tabla `Session`. Validación zod. Errores normalizados con `HttpError` (`{ error: { message } }`).
  - **API panel**: `GET /api/overview` (métricas + proyectos/actividad recientes), `GET /api/issues` (globales con filtro query category/severity), `GET /api/analyses` (globales), `GET /api/recommendations` (globales), `PATCH /api/projects/:id` y `DELETE /api/projects/:id` (CRUD completo).
  - **Web auth**: `lib/api.ts` (cliente fetch + token en localStorage), `lib/auth.tsx` (AuthProvider), `lib/providers.tsx` (Auth + TanStack Query), páginas `/auth/login` y `/auth/register` con identidad del sistema (spec-sheet light + bg-grid), estados loading/error/empty, mensajes en español, a11y.
  - **Web navbar**: botón "Iniciar sesión" cuando no hay sesión; "Panel de control" + nombre + "Cerrar sesión" con sesión activa (desktop y mobile).
  - **Web dashboard**: conectado a la API con TanStack Query (`lib/queries.ts`, `lib/mutations.ts`). Overview con métricas reales, Projects con CRUD (crear/conectar repo/eliminar), Issues y Security/Testing/Architecture (filtro por categoría), AI Review (recomendaciones), Activity, Settings (cuenta + logout), detalle de proyecto con puntuaciones reales del último análisis.
  - **Guard auth**: `DashboardShell` redirige a `/login` si no hay sesión; `/auth/*` con `noindex`.

## In progress

- Neon conectado (migración + seed OK, commit `067a3b6`). Pendiente: resolver conexión runtime de la API a Neon y deploy a Vercel. Ver `docs/ai-handoff/006-neon-migracion-seed-y-pulido-ui.md`.

## Pending

- Commit + push de la fase 3.6 y **pedir credenciales** (paso 3): Neon (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`) y Vercel (Project/Org ID + Token).
- **Neon**: aplicar migraciones (`prisma migrate dev`), conectar la API real, seed de datos de prueba para poblar el dashboard (blocked on credentials).
- **Vercel**: deploy frontend (decidir backend serverless vs infraestructura alternativa) (blocked on credentials).
- **Testing E2E**: Playwright (registro→login→crear proyecto→análisis) pendiente de entorno con DB.
- **API tests de integración**: vitest + supertest sobre rutas autenticadas, pendiente de DB real.
- **Graphify**: grafo de conocimiento de la arquitectura (Frontend→Backend→Services→Prisma→Neon) → guardar en `docs/`.
- **Documentación API**: `docs/api` con las rutas nuevas (auth, overview, issues globales, CRUD proyectos).

## Blocked

- Migraciones y datos reales en el dashboard (seed) dependen de credenciales Neon.
- Deploy depende de credenciales Vercel.

## Problems

- `npm run build` tarda ~1 min (Next compila 16 rutas + API tsc); timeout por defecto del shell requiere aumentarlo.
- Prisma no tiene parser de prettier (`schema.prisma` se excluye del formato).

## Solutions

- El dashboard sigue la identidad dark "instrumento" y el auth/landing la "spec sheet" light; ambas comparten tokens de `globals.css`.
- La sesión se guarda en la tabla `Session` (schema 3A) — sin JWT, logout elimina la sesión por token.

## Decisions

- **bcryptjs** en vez de bcrypt/argon2 (sin compilación nativa, portable en Windows).
- Token de sesión aleatorio de 64 hex chars con TTL 30 días.
- TanStack Query como capa de datos del dashboard (caché, invalidación tras mutaciones).
- El frontend nunca toca la DB; todo pasa por la API (regla dura).

## Credentials required

- NEON: `DATABASE_URL`, `DATABASE_URL_UNPOOLED` — PENDING (STOPPED AQUÍ)
- VERCEL: Project ID / Org ID / Token — PENDING
- GITHUB: remote configurado y push OK

## Environment configuration

- Node v22.16.0, npm 11.14.1, git 2.45.2, Python 3.12.10. Windows / PowerShell 5.1.

## Database status

- Schema de dominio v1 (Fase 3A) diseñado, `prisma validate` + `prisma generate` OK con DATABASE_URL dummy. Migraciones pendientes de credenciales Neon.

## Backend status

- Express + services + zod + auth Bearer por sesión. Rutas: `/auth/*` públicas (register/login) y autenticadas (logout/me); `projects`, `analyses`, `issues`, `recommendations`, `activity`, `overview` autenticadas. CRUD completo de proyectos. Sin DB real conectada aún.

## Frontend status

- Landing completa verde. Auth (login/register) con identidad y guard de sesión. Dashboard con datos reales vía TanStack Query en las 9 secciones + detalle. `noindex` en zona autenticada y auth.

## Testing status

- Vitest: web 9 tests (cn, CodePanel, api client) + api 8 tests (authService con prisma mockeado). Total 17/17. `npm test` corre ambos workspaces. Playwright pendiente.

## Deployment status

- Plan en DEPLOYMENT.md. No configurado. A la espera de Vercel.

## Vercel status

- Not configured. A la espera de credenciales.

## Neon status

- Not configured. A la espera de credenciales.

## GitHub status

- Remote `origin` → https://github.com/barbox11/DEVPILOT.git. Último push `5402496` (fase 3.5).

## Security status

- Env gitignored; `.env.example` templates versionados; hashing bcryptjs; token de sesión en `Session` con expiración; logout invalida sesión; error API enmascara >=500 en prod; frontend sin acceso a DB; sin secrets en código.

## Documentation status

- ARCHITECTURE, DEPLOYMENT, DATABASE, PROJECT_STATUS, ai-handoff 001–005. Falta: `docs/api` con rutas auth/nuevas, grafo graphify, Playwright.

## Next tasks

1. Resolver la conexión runtime de la API a Neon (la CLI conecta, el runtime dev no).
2. Deploy a Vercel (token recibido; falta Project/Org ID o `vercel link`) y decidir hosting del backend.
3. Conectar el dashboard a la DB real (validar login + overview + detalle + AI review).
4. Playwright E2E (registro→login→proyecto→análisis).
5. Graphify: grafo de arquitectura en `docs/`.
6. Documentar `docs/api` pendiente.

## Recommended next step

Resolver la conexión runtime de la API a Neon (diagnóstico en ai-handoff 006) y validar el dashboard con datos reales; después deploy a Vercel.