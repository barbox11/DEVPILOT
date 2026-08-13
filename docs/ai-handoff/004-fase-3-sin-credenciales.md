# 004 — Fase 3 sin credenciales: testing, CI, datos, API y dashboard shell

## Objetivo

Avanzar todo lo posible de la Fase 3 sin depender de credenciales externas (Neon/Vercel), y dejar la infraestructura lista para cuando lleguen.

## Realizado

- **A11y**: skip link ("Saltar al contenido principal", `layout.tsx`), `aria-label` del nav en español, eliminados enlaces muertos (footer con `<span>`, botón "Iniciar sesión" sin destino removido), corrección del CTA del hero "Ver cómo funciona" → `#como-funciona`.
- **SEO**: metadata completa (`layout.tsx`) con title por defecto "DevPilot — Análisis de código con IA", OG/Twitter, canonical, keywords, robots; JSON-LD `SoftwareApplication`; `robots.txt` y `sitemap.xml` en `public/`.
- **Testing**: vitest instalado (workspace web), `vitest.config.mts` con alias `@` y plugin react, `npm test` funcional (6 tests: `cn` + `CodePanel` smoke).
- **CI**: `.github/workflows/ci.yml` (npm ci → lint → typecheck → build → test, Node 22).
- **Fase 3A — Datos**: schema Prisma completo en `apps/api/prisma/schema.prisma`: `User, Session, Project, Analysis, Issue, Recommendation, GeneratedTest, Activity` + enums (`UserRole, AnalysisStatus, Severity, IssueCategory, IssueStatus, TestStatus`). `prisma validate` y `prisma generate` verificados con DATABASE_URL dummy.
- **Fase 3B — API**: capa services (`projectService, analysisService, issueService, recommendationService, activityService`), Prisma client singleton (`lib/prisma.ts`), validación con **zod** (`middleware/validate.ts`), auth middleware por Bearer session (`middleware/auth.ts`), rutas REST protegidas bajo `/api` (`projects, analyses, issues, recommendations, activity`).
- **Fase 3C — Dashboard**: shell con identidad dark de instrumento (`components/dashboard/`), navegación de 9 secciones (Overview, Projects, Issues, Security, Testing, Architecture, AI Review, Activity, Settings) + `projects/[id]` (Health Score, Quality, Security, Testing, Architecture, Último análisis, Recomendaciones IA). Estados: skeleton y empty; oculto a indexación (`robots: noindex`).

## Archivos clave

- `apps/web/src/app/{layout,dashboard/**}` · `apps/web/src/components/{dashboard/**}` · `apps/web/public/{robots,sitemap}.{txt,xml}` · `apps/web/vitest.config.mts`
- `apps/api/src/{lib,services,middleware,routes}/**` · `apps/api/prisma/schema.prisma`
- `.github/workflows/ci.yml`

## Decisiones

- Dashboard siempre en dark: el shell añade la clase `dark` al `<html>` mientras está montado (con limpieza si la preferencia guardada es light).
- El dashboard se marca `noindex` por diseño (zona autenticada).
- La API solo escribe DB vía services; rutas no tocan Prisma directamente (regla del master prompt).
- Auth de sesión implementado como middleware `requireAuth`; los endpoints de login/registro quedan para la fase de auth (próxima).

## Problemas / Soluciones

- Vitest v4 con pipeline oxc no transformaba JSX sin plugin → `@vitejs/plugin-react` en `vitest.config.mts`.
- `lint` de API: `import type { Prisma }` no sirve como valor (`Prisma.JsonNull`) → import normal.
- El bloque `@theme` de espaciado resultó inocuo (Tailwind resuelve con `calc(var(--spacing) * N)`).

## Tests

- `npm run lint` (web + api): 0 errores.
- `npm run typecheck` (web + api): 0 errores.
- `npm run build` (web: 1 landing estática + 10 rutas dashboard; api): 0 errores.
- `npm test`: 6/6.

## Pendientes

- Auth completa (registro/login/logout, hashing, JWT o sesión DB).
- Conectar servicios a datos reales: fetch desde el dashboard a la API (TanStack Query pendiente según master).
- Playwright E2E.
- Credenciales Neon (migraciones + conexión) y Vercel (deploy) — pedir al usuario.
- Partes 4-10 del master prompt pendientes de entrega para validación.

## Siguiente tarea sugerida

Auth (registro + login + sesión) sobre el schema Fase 3A, o pedir credenciales Neon para migraciones y poder conectar el dashboard a datos reales.

## Contexto para otra IA

- Identidad: spec sheet light (landing) / instrumento dark (dashboard). Tokens solo en `globals.css`.
- Reutilizables: `Container, Eyebrow, Button, SectionHeading, CodePanel, cn` (twMerge last-wins) y `components/dashboard/{view,icons,dashboard-shell}`.
- API: ESM estricto (`.js` en imports TS), validation zod, error normalizado `{ error: { message } }`, auth Bearer por `Session`.
- Rutas API actuales (todas autenticadas): `GET/POST /api/projects`, `GET /api/projects/:id`, `GET/POST /api/analyses/project/:projectId`, `GET /api/analyses/:id`, `GET /api/issues/analysis/:analysisId`, `PATCH /api/issues/:id/status`, `GET /api/recommendations/analysis/:analysisId`, `GET /api/activity`.
- `prisma generate` requiere DATABASE_URL (puede ser dummy para generar el cliente).
- CI: `.github/workflows/ci.yml`; `npm test` corre solo el workspace web.