# DevPilot Project Status

_Updated: 2026-08-18_

## Current phase

Fase Neon + deploy completada: la API runtime conecta a Neon (Neon), el dashboard queda
validado con datos reales y ambos proyectos (web + API) están desplegados en Vercel en
producción. Roadmap restante: E2E Playwright, tests de integración (vitest+supertest),
Graphify y documentación `docs/api`.

## Overall progress

~60%

## Completed

- Phase 1: monorepo (Next.js 15 web + Express api + Prisma), docs, verified green (commit b293b1f)
- Phase 2: design system + full landing
  - Identity "Diagnostic specification": paper palette (light) + instrument-console dark tokens (.dark)
  - Landing íntegra en español, dark mode, a11y y SEO (commits 13dceb5, 6853687, b13c375, 19a03ca)
- Phase 3 (sin credenciales): a11y/SEO, vitest, CI, schema Prisma (3A), services API (3B), dashboard shell (3C)
- Phase 3.5 (auth + datos reales) — commit `5402496`
- Phase 3.6 (UI/UX pulido) — commit `e070fbb`
- Neon migración + seed — commit `067a3b6`
- **Runtime API→Neon resuelto**: el fallo inicial de `Can't reach database server` era un
  cold start transitorio de Neon (el compute se auto-suspende). Con el `.env` directo
  (`?sslmode=require`, sin `channel_binding`, sin `-pooler`) y un arranque limpio, la API
  dev conecta y valida: login demo → token, overview `{projects:3, openIssues:4,
  recommendations:3, avgHealth:78}`, detalle de proyecto (4 issues + 3 recomendaciones) y
  AI review. El issue LOW del seed estaba en estado `ACCEPTED`; se pasó a `OPEN` para que
  las métricas coincidan con el spec (4 issues abiertos).
- **Deploy Vercel completado**:
  - API: `barbox/devpilot-api` → https://devpilot-api.vercel.app (preset Express, función
    serverless de Node). Se eliminó el `api/index.ts` experimental: Vercel detecta la app
    Express sola desde `src/app.ts`; tener un directorio `api/` hace que Vercel reserve
    `/api/*` con 404 y rompa el enrutado. `vercel.json` fija `npx prisma generate` como
    build. Env producción: `DATABASE_URL` (directa) y `CORS_ORIGIN`.
  - Web: `barbox/devpilot-web` → https://devpilot-web-bay.vercel.app (Next.js). Env
    producción: `NEXT_PUBLIC_API_URL` = https://devpilot-api.vercel.app (horneado en el
    bundle).
  - CORS validado (POST + preflight 204) desde el dominio real del web. `app.ts` ahora
    soporta `CORS_ORIGIN` con varios orígenes separados por coma.
  - Login, overview, detalle y AI review validados contra producción.

## In progress

Nada bloqueado. Siguiente ronda del roadmap.

## Pending

- **Testing E2E**: Playwright (registro→login→crear proyecto→análisis) contra entorno con DB
  (usar Neon + API en local o producción).
- **API tests de integración**: vitest + supertest sobre rutas autenticadas contra Neon.
- **Graphify**: grafo de conocimiento de la arquitectura → `docs/`.
- **Documentación API**: `docs/api` con auth, overview, issues, recommendations, CRUD proyectos.
- **Flujo de análisis real**: el pipeline de escaneo/revisión IA usa datos del seed; el
  pipeline real no está implementado.
- Mejoras de deploy: CI/CD automático, preview branches con `NEXT_PUBLIC_API_URL` por
  entorno, dominio custom.

## Blocked

Nada.

## Problems

- `npm run build` tarda ~1 min (Next compila 16 rutas + API tsc).
- Neon auto-suspende el compute en inactividad: la primera conexión tras un rato puede
  fallar con `Can't reach database server` hasta que despierta (reintentar resuelve).
- Prisma no tiene parser de prettier (`schema.prisma` se excluye del formato).
- `vercel build` local en Windows puede fallar con `EPERM` si un proceso node mantiene la
  DLL de Prisma (`query_engine-windows.dll.node`) abierta.

## Solutions

- El dashboard sigue la identidad dark "instrumento" y el auth/landing la "spec sheet"
  light; ambas comparten tokens de `globals.css`.
- La sesión se guarda en la tabla `Session` (schema 3A) — sin JWT, logout elimina la sesión por token.
- Backend serverless: Vercel preset Express detecta `src/app.ts` y sirve todas las rutas
  en una función Node. `vercel.json` fuerza `npx prisma generate` en build.

## Decisions

- **bcryptjs** en vez de bcrypt/argon2 (sin compilación nativa, portable en Windows).
- Token de sesión aleatorio de 64 hex chars con TTL 30 días.
- TanStack Query como capa de datos del dashboard (caché, invalidación tras mutaciones).
- El frontend nunca toca la DB; todo pasa por la API (regla dura).
- **Hosting**: API y web juntos en Vercel (dos proyectos). URL directa de Neon en vez de
  pooled (el query engine de Prisma no alcanza el pooler con `channel_binding=require`).
- **CORS multi-origen**: `CORS_ORIGIN` acepta lista separada por comas.

## Credentials required

- NEON: `DATABASE_URL`, `DATABASE_URL_UNPOOLED` — en `apps/api/.env` (gitignored). OK.
- VERCEL: Project/Org IDs + token — usados vía CLI (`auth.json` en AppData, gitignored). OK.
- GITHUB: remote configurado y push OK.

## Environment configuration

- Node v22.16.0, npm 11.14.1, git 2.45.2, Python 3.12.10. Windows / PowerShell 5.1.
- Vercel CLI 58.5.1 (global).

## Database status

- Neon conectado: migración `20260814155613_init` + seed aplicados. Datos demo:
  `demo@devpilot.app` / `devpilot123`, 3 proyectos, 1 análisis (health 78), 4 issues OPEN,
  3 recomendaciones, 3 generated tests, 3 actividades.

## Backend status

- Express + services + zod + auth Bearer por sesión. Rutas: `/auth/*` públicas
  (register/login) y autenticadas (logout/me); projects, analyses, issues, recommendations,
  activity, overview. CRUD completo de proyectos. **Conectado a Neon** (dev y prod).

## Frontend status

- Landing completa verde. Auth (login/register) con identidad y guard de sesión. Dashboard
  con datos reales vía TanStack Query en las 9 secciones + detalle. `noindex` en zona
  autenticada y auth. **Desplegado** en Vercel apuntando a la API de producción.

## Testing status

- Vitest: web 9 tests (cn, CodePanel, api client) + api 8 tests (authService con prisma
  mockeado). Total 17/17. `npm test` corre ambos workspaces. Playwright pendiente.

## Deployment status

- Producción activa: web https://devpilot-web-bay.vercel.app · API https://devpilot-api.vercel.app.
  Validado login + overview + detalle + AI review + CORS. Detalles en `docs/deployment/DEPLOYMENT.md`.

## Vercel status

- Configurado. Org `barbox`, proyectos `devpilot-api` y `devpilot-web`. Env de producción
  cargados. Deploy manual por CLI (aún sin CI/CD).

## Neon status

- Configurado y conectado (dev y producción). Rama `main`.

## GitHub status

- Remote `origin` → https://github.com/barbox11/DEVPILOT.git.

## Security status

- Env gitignored; `.env.example` templates versionados; hashing bcryptjs; token de sesión
  en `Session` con expiración; logout invalida sesión; error API enmascara >=500 en prod;
  frontend sin acceso a DB; sin secrets en código. Credenciales de Neon/Vercel nunca en
  docs ni commits.

## Documentation status

- ARCHITECTURE, DEPLOYMENT, DATABASE, PROJECT_STATUS, ai-handoff 001–007. Falta:
  `docs/api` con rutas auth/nuevas, grafo graphify, guía E2E Playwright.

## Next tasks

1. Validar el dashboard completo en navegador contra producción (login demo → overview →
   detalle → AI review).
2. Playwright E2E (registro→login→proyecto→análisis).
3. Tests de integración vitest+supertest contra Neon.
4. Graphify: grafo de arquitectura en `docs/`.
5. Documentar `docs/api`.
6. Mejoras de deploy: CI/CD, preview branches, dominio custom.

## Recommended next step

Validar el dashboard en navegador con el usuario demo contra la API de producción
(https://devpilot-web-bay.vercel.app), y luego arrancar Playwright E2E.